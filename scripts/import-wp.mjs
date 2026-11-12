// Imports posts and products from a WordPress + WooCommerce export into clean JSON.
// Usage: node scripts/import-wp.mjs
// Input:  scripts/wp-export/posts_full.json   (wp-json/wp/v2/posts?_embed=1)
//         scripts/wp-export/products_full.json (wp-json/wc/store/v1/products)
//         content/shelves.json                 (shelf mapping and slug overrides)
// Output: content/posts.json, content/guides.json, content/redirects.json
//         public/images/posts/*, public/images/guides/*
//
// The same script runs again at launch against the live API so nothing is retyped.

import { load } from "cheerio";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ORIGIN = "https://www.accordingtomodishyeblog.com";
const CATEGORY_NAMES = { 19: "Passions", 63: "School", 64: "Financial", 65: "Culture" };

const posts = JSON.parse(readFileSync(join(ROOT, "scripts/wp-export/posts_full.json"), "utf8"));
const products = JSON.parse(readFileSync(join(ROOT, "scripts/wp-export/products_full.json"), "utf8"));
const shelves = JSON.parse(readFileSync(join(ROOT, "content/shelves.json"), "utf8"));

const postToShelf = new Map();
for (const shelf of shelves.shelves) for (const slug of shelf.posts) postToShelf.set(slug, shelf.slug);

const decode = (s) => load(`<p>${s}</p>`)("p").text();

const titleCase = (s) =>
  decode(s)
    .toLowerCase()
    .replace(/(^|\s|[("'])([a-z])/g, (m, pre, ch) => pre + ch.toUpperCase())
    .replace(/\b(A|An|And|As|At|But|By|For|In|Of|On|Or|The|To|With)\b/g, (w, i) => (i === 0 ? w : w.toLowerCase()))
    .replace(/\(Part (\d)\)/i, "(Part $1)")
    .replace(/\bU\.s\./g, "U.S.")
    .replace(/\bI\b/g, "I");

async function download(url, dir, base) {
  if (!url) return null;
  const clean = url.split("?")[0];
  let ext = extname(clean).toLowerCase() || ".png";
  if (![".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(ext)) ext = ".png";
  const file = `${base}${ext}`;
  const target = join(ROOT, "public/images", dir, file);
  if (!existsSync(target)) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status}`);
      mkdirSync(join(ROOT, "public/images", dir), { recursive: true });
      writeFileSync(target, Buffer.from(await res.arrayBuffer()));
    } catch (e) {
      console.warn("image failed", url, e.message);
      return null;
    }
  }
  return `/images/${dir}/${file}`;
}

function cleanHtml(raw, slug, inlineImages) {
  let html = raw.replace(/\[\/?et_pb_[^\]]*\]/g, "");
  const $ = load(html, null, false);

  $("script, style, iframe, noscript, form, input, button, svg").remove();
  $("h1").each((_, el) => (el.tagName = "h2"));
  $("h4, h5, h6").each((_, el) => (el.tagName = "h3"));

  // Elementor puts body paragraphs in <p class="elementor-heading-title"> with raw blank lines inside.
  $("p").each((_, el) => {
    const inner = $(el).html() ?? "";
    if (/\n\s*\n/.test(inner)) {
      const parts = inner.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
      $(el).replaceWith(parts.map((s) => `<p>${s}</p>`).join("\n"));
    }
  });

  let imgIndex = 0;
  $("img").each((_, el) => {
    const src = $(el).attr("data-src") || $(el).attr("src") || "";
    const alt = ($(el).attr("alt") || "").trim();
    inlineImages.push({ el, src, alt, index: imgIndex++ });
  });

  // Unwrap layout wrappers until none remain.
  for (let i = 0; i < 12; i++) {
    const wrappers = $("div, section, span, figure, article, header, footer, center, font");
    if (!wrappers.length) break;
    wrappers.each((_, el) => $(el).replaceWith($(el).html() ?? ""));
  }

  $("*").each((_, el) => {
    const keep = el.tagName === "a" ? ["href"] : el.tagName === "img" ? ["src", "alt", "width", "height"] : [];
    for (const name of Object.keys(el.attribs)) if (!keep.includes(name)) $(el).removeAttr(name);
    if (el.tagName === "a") {
      const href = $(el).attr("href") || "";
      if (/^https?:\/\//.test(href) && !href.startsWith(ORIGIN)) {
        $(el).attr("rel", "noopener");
      }
    }
  });

  // Strip empty blocks.
  $("p, h2, h3, li").each((_, el) => {
    const text = $(el).text().replace(/ /g, " ").trim();
    if (!text && !$(el).find("img").length) $(el).remove();
  });
  $("br + br").remove();

  // Ensure stray text nodes at root are wrapped.
  const out = $.root()
    .html()
    .replace(/ /g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return out;
}

const seenSlugs = new Set();
const redirects = [];
const outPosts = [];

for (const p of posts) {
  const legacySlug = p.slug;
  const slug = shelves.slugOverrides[legacySlug] || legacySlug;
  if (seenSlugs.has(slug)) throw new Error(`duplicate slug ${slug}`);
  seenSlugs.add(slug);

  const featured = p._embedded?.["wp:featuredmedia"]?.[0];
  const cover = await download(featured?.source_url, "posts", slug);

  const videoMatch = p.content.rendered.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/);
  const videoId = videoMatch ? videoMatch[1] : null;
  const inlineImages = [];
  let html = cleanHtml(p.content.rendered, slug, inlineImages);

  // Download inline images and rewrite their src.
  const $ = load(html, null, false);
  let idx = 0;
  for (const img of $("img").toArray()) {
    const src = $(img).attr("src") || "";
    if (!src) { $(img).remove(); continue; }
    const local = await download(src, "posts", `${slug}-${++idx}`);
    if (!local) { $(img).remove(); continue; }
    $(img).attr("src", local);
    $(img).attr("loading", "lazy");
    if (!$(img).attr("alt")) $(img).attr("alt", "");
  }
  // Rewrite internal links to new slugs.
  for (const a of $("a").toArray()) {
    const href = $(a).attr("href") || "";
    if (href.startsWith(ORIGIN)) {
      const path = href.slice(ORIGIN.length).replace(/\/$/, "").replace(/^\//, "");
      const target = posts.find((q) => q.slug === path);
      $(a).attr("href", target ? `/articles/${shelves.slugOverrides[target.slug] || target.slug}` : href.slice(ORIGIN.length) || "/");
    }
  }
  html = $.root().html().trim();

  const text = load(`<div>${html}</div>`)("div").text().replace(/\s+/g, " ").trim();
  const words = text.split(" ").filter(Boolean).length;
  let excerpt = decode(p.excerpt.rendered.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  if (excerpt.length < 40) excerpt = text;
  excerpt = excerpt.replace(/\[…\]|\[&hellip;\]|…$/g, "").trim();
  const description = excerpt.length > 155 ? excerpt.slice(0, 152).replace(/\s+\S*$/, "") + "..." : excerpt;

  const categories = p.categories.map((id) => CATEGORY_NAMES[id]).filter(Boolean);
  const shelf = postToShelf.get(legacySlug) || (categories.includes("Financial") ? "money" : categories.includes("School") ? "surviving-college" : "culture-and-voice");

  outPosts.push({
    slug,
    legacySlug,
    title: shelves.titles?.[legacySlug] || titleCase(p.title.rendered),
    video: videoId,
    date: p.date_gmt.slice(0, 10),
    modified: p.modified_gmt.slice(0, 10),
    shelf,
    categories,
    cover,
    coverAlt: featured?.alt_text || `Cover art for ${shelves.titles?.[legacySlug] || titleCase(p.title.rendered)}`,
    description,
    excerpt: excerpt.length > 240 ? excerpt.slice(0, 237).replace(/\s+\S*$/, "") + "..." : excerpt,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    words,
    html,
  });
  if (legacySlug !== slug) redirects.push({ source: `/${legacySlug}`, destination: `/articles/${slug}` });
  redirects.push({ source: `/${legacySlug === slug ? slug : legacySlug}/`, destination: `/articles/${slug}` });
  if (legacySlug === slug) redirects.push({ source: `/${slug}`, destination: `/articles/${slug}` });
}

outPosts.sort((a, b) => (a.date < b.date ? 1 : -1));

const outGuides = [];
for (const pr of products) {
  const meta = shelves.guides[pr.slug];
  if (!meta) { console.warn("unmapped product", pr.slug); continue; }
  const raw = pr.description && !pr.description.includes("[et_pb") ? pr.description : pr.short_description || "";
  let html = cleanHtml(raw, meta.slug, []);
  if (!html.includes("<p")) html = html.split(/\n+/).map((l) => l.trim()).filter(Boolean).map((l) => `<p>${l}</p>`).join("\n");
  const text = load(`<div>${html}</div>`)("div").text().replace(/\s+/g, " ").trim();
  const image = await download(pr.images?.[0]?.src, "guides", meta.slug);
  const description = text.length > 155 ? text.slice(0, 152).replace(/\s+\S*$/, "") + "..." : text;
  outGuides.push({
    ...meta,
    legacySlug: pr.slug,
    wooId: pr.id,
    price: Number(pr.prices.price) / 100,
    currency: pr.prices.currency_code,
    image,
    imageAlt: pr.images?.[0]?.alt || `${meta.title} cover`,
    description,
    html,
  });
  redirects.push({ source: `/product/${pr.slug}`, destination: `/guides/${meta.slug}` });
}

// Legacy page redirects (old WP structure and theme demo pages).
for (const [source, destination] of Object.entries({
  "/about-the-blogger": "/about", "/about-me": "/about", "/about-us-2": "/about", "/author-profile": "/about", "/authors": "/about", "/authors-2": "/about",
  "/contact-me": "/contact", "/contact-old": "/contact",
  "/articles-2": "/library", "/articles": "/library", "/articles-to-read": "/library", "/blog": "/library",
  "/shop": "/guides", "/products": "/guides", "/cart": "/guides", "/checkout": "/guides",
  "/category/school": "/library/surviving-college", "/category/financial": "/library/money", "/category/culture": "/library/culture-and-voice", "/category/passions": "/library/culture-and-voice",
  "/privacy-policy-2": "/privacy-policy", "/privacy-policy-2023": "/privacy-policy", "/cookies-policy": "/privacy-policy", "/cookies-usage": "/privacy-policy",
  "/refund-policy": "/terms", "/refund-terms": "/terms", "/terms-and-conditions": "/terms", "/terms-of-service": "/terms", "/earnings-disclaimer": "/terms",
  "/home-page-craft": "/", "/home-3-pro": "/", "/home-old": "/", "/main": "/", "/books-pro": "/library", "/single-book": "/library", "/book-club-pro": "/library", "/services": "/guides", "/submissions": "/contact", "/how-it-works": "/about", "/buy-adspace": "/contact", "/disable-ads": "/",
})) redirects.push({ source, destination });

// Legal pages carried over verbatim.
const pagesRaw = JSON.parse(readFileSync(join(ROOT, "scripts/wp-export/pages_full.json"), "utf8"));
const outPages = [];
for (const [wpSlug, slug, title] of [["privacy-policy", "privacy-policy", "Privacy Policy"], ["terms-of-service", "terms", "Terms of Service"], ["refund-terms", "refunds", "Refund Terms"], ["cookies-usage", "cookies", "Cookies"]]) {
  const pg = pagesRaw.find((x) => x.slug === wpSlug);
  if (!pg) continue;
  const html = cleanHtml(pg.content.rendered, slug, []);
  outPages.push({ slug, title, modified: pg.modified.slice(0, 10), html });
}
writeFileSync(join(ROOT, "content/pages.json"), JSON.stringify(outPages, null, 2));

writeFileSync(join(ROOT, "content/posts.json"), JSON.stringify(outPosts, null, 2));
writeFileSync(join(ROOT, "content/guides.json"), JSON.stringify(outGuides, null, 2));
writeFileSync(join(ROOT, "content/redirects.json"), JSON.stringify(redirects, null, 2));
console.log(`posts: ${outPosts.length}, guides: ${outGuides.length}, redirects: ${redirects.length}`);
for (const p of outPosts) console.log(`${p.date}  ${p.shelf.padEnd(20)} ${p.readingMinutes}m  ${p.title}`);
