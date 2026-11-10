import { cache } from "react";
import { draftMode } from "next/headers";
import type { PortableTextBlock } from "@portabletext/types";
import { client, draftClient } from "./client";
import { urlFor } from "./image";
import { blocksToHtml, blocksToText, firstParagraph } from "./html";
import { youtubeId } from "@/lib/youtube";
import type { Guide, LegalPage, Post } from "@/lib/content";
import { colours, type Colour } from "@/lib/site";

export const CONTENT_TAG = "sanity-content";

type Img = { asset?: { _ref: string }; alt?: string; hotspot?: unknown; crop?: unknown } | null;

type ArticleDoc = {
  _updatedAt: string;
  title: string;
  slug: string;
  shelf: string;
  categories?: string[];
  legacySlug?: string;
  legacyModified?: string;
  migratedAt?: string;
  publishedAt: string;
  description?: string;
  video?: string;
  cover?: Img;
  body?: PortableTextBlock[];
};
type GuideDoc = {
  _updatedAt: string;
  title: string;
  slug: string;
  subtitle?: string;
  shelf: string;
  colour?: string;
  pages?: string;
  audience?: string;
  legacySlug?: string;
  wooId?: number;
  price: number;
  currency?: string;
  description?: string;
  shopifyHandle?: string;
  image?: Img;
  body?: PortableTextBlock[];
};
type PageDoc = { _updatedAt: string; title: string; slug: string; legacyModified?: string; migratedAt?: string; body?: PortableTextBlock[] };

const imageFields = `asset, hotspot, crop, alt`;
const bodyFields = `body[]{ ..., _type == "image" => { ..., "dimensions": asset->metadata.dimensions } }`;

const query = `{
  "posts": *[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
    _updatedAt, title, "slug": slug.current, shelf, categories, legacySlug, legacyModified, migratedAt, publishedAt, description, video,
    cover{ ${imageFields} }, ${bodyFields}
  },
  "guides": *[_type == "guide" && defined(slug.current)] | order(coalesce(order, 99) asc, title asc) {
    _updatedAt, title, "slug": slug.current, subtitle, shelf, colour, pages, audience, legacySlug, wooId, price, currency, description, shopifyHandle,
    image{ ${imageFields} }, ${bodyFields}
  },
  "pages": *[_type == "legalPage" && defined(slug.current)] | order(title asc) {
    _updatedAt, title, "slug": slug.current, legacyModified, migratedAt, ${bodyFields}
  }
}`;

async function isDraft() {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

const day = (iso: string) => iso.slice(0, 10);

// Migrated documents carry the date they were last edited on WordPress. That date stays until she edits the
// document in the portal, at which point Sanity's own timestamp takes over.
function modifiedDate(doc: { _updatedAt: string; legacyModified?: string; migratedAt?: string }) {
  if (doc.legacyModified && doc.migratedAt && Date.parse(doc._updatedAt) - Date.parse(doc.migratedAt) < 120_000) return doc.legacyModified;
  return day(doc._updatedAt);
}

function cover(img: Img | undefined, width: number, height?: number) {
  if (!img?.asset) return null;
  const b = urlFor(img).width(width);
  return (height ? b.height(height).fit("crop") : b).url();
}

function trim(text: string, max = 155) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 3).replace(/\s+\S*$/, "") + "..." : t;
}

function toPost(a: ArticleDoc): Post {
  const html = blocksToHtml(a.body);
  const text = blocksToText(a.body);
  const words = text.split(/\s+/).filter(Boolean).length;
  const description = trim(a.description || firstParagraph(a.body) || a.title);
  return {
    slug: a.slug,
    legacySlug: a.legacySlug ?? a.slug,
    title: a.title,
    date: day(a.publishedAt),
    modified: modifiedDate(a),
    shelf: a.shelf,
    categories: a.categories ?? [],
    cover: cover(a.cover, 1600, 842),
    coverAlt: a.cover?.alt ?? "",
    description,
    excerpt: trim(firstParagraph(a.body) || description, 240),
    readingMinutes: Math.max(1, Math.round(words / 200)),
    words,
    html,
    video: youtubeId(a.video),
  };
}

function toGuide(g: GuideDoc): Guide {
  const colour = (g.colour && g.colour in colours ? g.colour : "gold") as Colour;
  return {
    slug: g.slug,
    legacySlug: g.legacySlug ?? g.slug,
    wooId: g.wooId ?? 0,
    title: g.title,
    subtitle: g.subtitle ?? "",
    shelf: g.shelf,
    colour,
    pages: g.pages ?? "PDF",
    audience: g.audience ?? "",
    price: g.price,
    currency: g.currency ?? "USD",
    image: cover(g.image, 1200),
    imageAlt: g.image?.alt ?? `${g.title} cover`,
    description: g.description ?? "",
    html: blocksToHtml(g.body),
    shopifyHandle: g.shopifyHandle || null,
  };
}

function toPage(p: PageDoc): LegalPage {
  return { slug: p.slug, title: p.title, modified: modifiedDate(p), html: blocksToHtml(p.body) };
}

export type Content = { posts: Post[]; guides: Guide[]; pages: LegalPage[] };

// One request per render for everything. Her whole library is a few hundred kilobytes.
export const loadContent = cache(async (): Promise<Content> => {
  const draft = await isDraft();
  const c = draft ? draftClient : client;
  const data = await c.fetch<{ posts: ArticleDoc[]; guides: GuideDoc[]; pages: PageDoc[] }>(
    query,
    {},
    draft ? { cache: "no-store" } : { cache: "force-cache", next: { tags: [CONTENT_TAG] } }
  );
  return {
    posts: data.posts.map(toPost),
    guides: data.guides.map(toGuide),
    pages: data.pages.map(toPage),
  };
});
