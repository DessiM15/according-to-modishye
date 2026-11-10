// One-time move of the imported WordPress content into Sanity.
// Reads content/*.json (from scripts/import-wp.mjs), uploads the images, converts HTML to Portable Text
// and writes the documents. Safe to re-run before launch: documents are replaced by id.
// After launch the portal is the source of truth, so do not re-run it without checking with her first.
//
//   npm run migrate:sanity -- --dry            prints what would be written, touches nothing
//   npm run migrate:sanity                      needs NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";
import { htmlToPortableText } from "@portabletext/html";
import { compileSchema, defineSchema } from "@portabletext/schema";
import { JSDOM } from "jsdom";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const dry = args.includes("--dry");
const outIndex = args.indexOf("--out");
const outFile = outIndex >= 0 ? args[outIndex + 1] : null;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!dry && (!projectId || !token)) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN in .env.local, or run with --dry.");
  process.exit(1);
}
const client = dry ? null : createClient({ projectId, dataset, token, apiVersion: "2025-01-01", useCdn: false });

const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, "content", f), "utf8"));
const posts = read("posts.json");
const guides = read("guides.json");
const pages = read("pages.json");
const migratedAt = new Date().toISOString();

// Images: upload each local file once, reuse the asset id.
const assets = new Map();
async function upload(src) {
  if (!src) return null;
  const file = path.join(ROOT, "public", src.replace(/^\//, ""));
  if (!fs.existsSync(file)) {
    console.warn("  missing image, skipped:", src);
    return null;
  }
  if (assets.has(file)) return assets.get(file);
  let id = `image-dry-${assets.size}`;
  if (!dry) {
    const a = await client.assets.upload("image", fs.createReadStream(file), { filename: path.basename(file) });
    id = a._id;
  }
  assets.set(file, id);
  return id;
}

// The same shape as studio/schemaTypes/blockContent.ts.
const schema = compileSchema(
  defineSchema({
    decorators: [{ name: "strong" }, { name: "em" }],
    styles: [{ name: "normal" }, { name: "h2" }, { name: "h3" }, { name: "blockquote" }],
    lists: [{ name: "bullet" }, { name: "number" }],
    annotations: [{ name: "link", fields: [{ name: "href", type: "string" }] }],
    blockObjects: [
      { name: "image", fields: [{ name: "alt", type: "string" }] },
      { name: "youtube", fields: [{ name: "url", type: "string" }] },
    ],
  })
);

const key = () => randomUUID().replace(/-/g, "").slice(0, 12);
function withKeys(blocks) {
  for (const b of blocks) {
    b._key ||= key();
    if (Array.isArray(b.children)) for (const c of b.children) c._key ||= key();
    if (Array.isArray(b.markDefs)) for (const m of b.markDefs) m._key ||= key();
  }
  return blocks;
}

function normaliseHtml(html) {
  return html
    .replace(/<(\/?)h1\b/g, "<$1h2")
    .replace(/<(\/?)h[4-6]\b/g, "<$1h3")
    .replace(/<(\/?)b\b/g, "<$1strong")
    .replace(/<(\/?)i\b/g, "<$1em");
}

async function toBlocks(html, fallbackAlt = "") {
  if (!html?.trim()) return [];
  html = normaliseHtml(html);
  const doc = new JSDOM(html).window.document;
  const ids = new Map();
  for (const img of doc.querySelectorAll("img")) {
    const src = img.getAttribute("src");
    const id = await upload(src);
    if (id) ids.set(src, id);
  }
  const blocks = htmlToPortableText(html, {
    schema,
    parseHtml: (h) => new JSDOM(h).window.document,
    types: {
      image: ({ context, value, isInline }) => {
        if (isInline) return undefined;
        const id = ids.get(value.src);
        if (!id) return undefined;
        return { _type: "image", _key: context.keyGenerator(), asset: { _type: "reference", _ref: id }, alt: value.alt || fallbackAlt };
      },
    },
    rules: [
      {
        deserialize(el, _next, createBlock) {
          if (el.tagName?.toLowerCase() !== "iframe") return undefined;
          const src = el.getAttribute("src") || "";
          return /youtu/.test(src) ? createBlock({ _type: "youtube", url: src }) : undefined;
        },
      },
    ],
  });
  return withKeys(blocks);
}

const image = (id, alt) => (id ? { _type: "image", asset: { _type: "reference", _ref: id }, alt: alt || "" } : undefined);
const slug = (s) => ({ _type: "slug", current: s });
const docs = [];

console.log(`Articles: ${posts.length}`);
for (const p of posts) {
  docs.push({
    _id: `article-${p.slug}`,
    _type: "article",
    title: p.title,
    slug: slug(p.slug),
    shelf: p.shelf,
    categories: p.categories,
    legacySlug: p.legacySlug !== p.slug ? p.legacySlug : undefined,
    legacyModified: p.modified,
    migratedAt,
    publishedAt: `${p.date}T12:00:00.000Z`,
    description: p.description,
    video: p.video ? `https://www.youtube.com/watch?v=${p.video}` : undefined,
    cover: image(await upload(p.cover), p.coverAlt),
    body: await toBlocks(p.html, `Image from the article ${p.title}`),
  });
  console.log(`  ${p.date}  ${p.title}`);
}

console.log(`Guides: ${guides.length}`);
for (const [i, g] of guides.entries()) {
  docs.push({
    _id: `guide-${g.slug}`,
    _type: "guide",
    title: g.title,
    subtitle: g.subtitle,
    slug: slug(g.slug),
    shelf: g.shelf,
    colour: g.colour,
    pages: g.pages,
    audience: g.audience,
    description: g.description,
    price: g.price,
    currency: g.currency || "USD",
    shopifyHandle: g.shopifyHandle || undefined,
    order: i + 1,
    legacySlug: g.legacySlug,
    wooId: g.wooId,
    image: image(await upload(g.image), g.imageAlt),
    body: await toBlocks(g.html, `${g.title} preview`),
  });
  console.log(`  $${g.price}  ${g.title}`);
}

console.log(`Legal pages: ${pages.length}`);
for (const p of pages) {
  docs.push({ _id: `legal-${p.slug}`, _type: "legalPage", title: p.title, slug: slug(p.slug), legacyModified: p.modified, migratedAt, body: await toBlocks(p.html) });
  console.log(`  /${p.slug}`);
}

for (const d of docs) for (const k of Object.keys(d)) if (d[k] === undefined) delete d[k];

if (outFile) {
  fs.writeFileSync(outFile, JSON.stringify(docs, null, 2));
  console.log(`Wrote ${docs.length} documents to ${outFile}`);
}
if (dry) {
  console.log(`Dry run: ${docs.length} documents, ${assets.size} images. Nothing written.`);
  process.exit(0);
}

// Replace in batches so one failure does not leave half a library behind.
for (let i = 0; i < docs.length; i += 20) {
  const tx = client.transaction();
  for (const d of docs.slice(i, i + 20)) tx.createOrReplace(d);
  await tx.commit();
  console.log(`Wrote ${Math.min(i + 20, docs.length)}/${docs.length}`);
}
// Stamp each document with the time it was actually written. The site shows the WordPress "last updated" date
// until a document is edited in the portal, and it tells the two apart by comparing _updatedAt with migratedAt.
const written = await client.fetch(`*[_id in $ids]{_id, _updatedAt}`, { ids: docs.map((d) => d._id) });
const stamp = client.transaction();
for (const w of written) stamp.patch(w._id, { set: { migratedAt: w._updatedAt } });
await stamp.commit();
console.log(`Done. ${docs.length} documents, ${assets.size} images uploaded to ${projectId}/${dataset}.`);
