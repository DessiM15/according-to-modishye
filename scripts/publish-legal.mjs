// Turns the lawyer's legal documents (docs/legal-<date>/*.txt) into portal documents.
//
//   node --env-file=.env.local scripts/publish-legal.mjs docs/legal-2026-11-26 2026-11-26            dry run, prints a summary
//   node --env-file=.env.local scripts/publish-legal.mjs docs/legal-2026-11-26 2026-11-26 --publish  writes to Sanity (live at once)
//   ... --publish refunds,cookies                                                                     writes only those pages
//
// Both runs also rewrite content/pages.json, the copy the site falls back to without Sanity.
//
// Text format: "## " section heading, "### " small heading, "- " bullet, a blank line between paragraphs,
// lines with no blank line between them stay in one paragraph with line breaks. Inline: **bold**,
// [text](address), and a literal \n for a line break. Email and web addresses become links on their own.
import { readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { toHTML, uriLooksSafe } from "@portabletext/to-html";

const [dir, date, flag, onlyArg] = process.argv.slice(2);
if (!dir || !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) throw new Error("Usage: publish-legal.mjs <folder> <YYYY-MM-DD> [--publish]");
const publish = flag === "--publish";
// Optional fourth argument: comma separated web addresses to send, for example "refunds,cookies". Default is all four.
const only = onlyArg ? onlyArg.split(",") : null;

const pages = [
  { slug: "privacy-policy", id: "legal-privacy-policy", title: "Privacy Policy" },
  { slug: "terms", id: "legal-terms", title: "Terms of Service" },
  { slug: "refunds", id: "legal-refunds", title: "Refund Terms" },
  { slug: "cookies", id: "legal-cookies", title: "Cookies" },
];

const key = () => randomBytes(6).toString("hex");
const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s)]*[^\s).,;])|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function spans(text, markDefs, marks = []) {
  const out = [];
  const push = (t, m = marks) => t && out.push({ _type: "span", _key: key(), marks: m, text: t });
  const link = (href) => {
    const k = key();
    markDefs.push({ _key: k, _type: "link", href });
    return k;
  };
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(...spans(m[1], markDefs, [...marks, "strong"]));
    else if (m[2] !== undefined) push(m[2], [...marks, link(m[3])]);
    else if (m[4] !== undefined) push(m[4], [...marks, link(m[4])]);
    else push(m[5], [...marks, link(`mailto:${m[5]}`)]);
    last = m.index + m[0].length;
  }
  push(text.slice(last));
  return out;
}

function block(text, extra = {}) {
  const markDefs = [];
  const children = spans(text.replaceAll("\\n", "\n"), markDefs);
  return { _type: "block", _key: key(), style: "normal", markDefs, children, ...extra };
}

function toBlocks(source) {
  const blocks = [];
  let para = [];
  const flush = () => {
    if (para.length) blocks.push(block(para.join("\n")));
    para = [];
  };
  for (const raw of source.split("\n")) {
    const line = raw.trim();
    if (!line) flush();
    else if (line.startsWith("### ")) (flush(), blocks.push(block(line.slice(4), { style: "h3" })));
    else if (line.startsWith("## ")) (flush(), blocks.push(block(line.slice(3), { style: "h2" })));
    else if (line.startsWith("- ")) (flush(), blocks.push(block(line.slice(2), { listItem: "bullet", level: 1 })));
    else para.push(line);
  }
  flush();
  return blocks;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const html = (blocks) =>
  toHTML(blocks, {
    components: {
      marks: {
        link: ({ children, value }) => {
          const href = value?.href ?? "";
          if (!href || !uriLooksSafe(href)) return children;
          const external = /^https?:/i.test(href) && !href.includes("accordingtomodishyeblog.com");
          return `<a href="${esc(href)}"${external ? ' rel="noopener" target="_blank"' : ""}>${children}</a>`;
        },
      },
    },
  });

const text = (b) => b.children.map((c) => c.text).join("");
const built = pages.map((p) => {
  const source = readFileSync(`${dir}/${p.slug}.txt`, "utf8");
  const body = toBlocks(source);
  const count = (f) => body.filter(f).length;
  const leftovers = body.filter((b) => /\*\*|\]\(|\\n|^#|\[insert/i.test(text(b))).map((b) => text(b).slice(0, 90));
  console.log(
    `${p.slug}: ${body.length} blocks, ${count((b) => b.style === "h2")} sections, ${count((b) => b.style === "h3")} small headings, ` +
      `${count((b) => b.listItem)} bullets, ${body.reduce((n, b) => n + b.markDefs.length, 0)} links, ${text({ children: body.flatMap((b) => b.children) }).split(/\s+/).length} words`,
  );
  for (const l of leftovers) console.log(`  CHECK: ${l}`);
  return { ...p, body };
});

writeFileSync(
  "content/pages.json",
  JSON.stringify(built.map((p) => ({ slug: p.slug, title: p.title, modified: date, html: html(p.body) })), null, 2) + "\n",
);
console.log("content/pages.json rewritten");

if (!publish) {
  console.log("Dry run. Nothing sent to Sanity. Add --publish to go live.");
  process.exit(0);
}

const { NEXT_PUBLIC_SANITY_PROJECT_ID: project, NEXT_PUBLIC_SANITY_DATASET: dataset = "production", SANITY_API_WRITE_TOKEN: token } = process.env;
if (!project || !token) throw new Error("Sanity project id or write token missing from the environment");

// legacyModified plus migratedAt make the page print the lawyer's date as "Last updated" until she next edits it in the portal.
const migratedAt = new Date().toISOString();
const mutations = built.filter((p) => !only || only.includes(p.slug)).map((p) => ({ patch: { id: p.id, set: { body: p.body, legacyModified: date, migratedAt } } }));
const res = await fetch(`https://${project}.api.sanity.io/v2024-01-01/data/mutate/${dataset}?returnIds=true`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ mutations }),
});
const json = await res.json();
if (!res.ok) throw new Error(JSON.stringify(json));
console.log("Published:", json.results.map((r) => r.id).join(", "));
