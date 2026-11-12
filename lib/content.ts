// Content layer. Pages call these functions and never talk to the CMS directly.
// With NEXT_PUBLIC_SANITY_PROJECT_ID set, content comes from Sanity (her portal).
// Without it, the JSON produced by scripts/import-wp.mjs is used, which is how the mockup runs.
import postsJson from "@/content/posts.json";
import guidesJson from "@/content/guides.json";
import pagesJson from "@/content/pages.json";
import shelvesJson from "@/content/shelves.json";
import type { Colour } from "@/lib/site";
import { hasSanity } from "@/lib/sanity/client";

export type Post = {
  slug: string;
  legacySlug: string;
  title: string;
  date: string;
  modified: string;
  shelf: string;
  categories: string[];
  cover: string | null;
  coverAlt: string;
  description: string;
  excerpt: string;
  readingMinutes: number;
  words: number;
  html: string;
  video: string | null;
};

export type Shelf = {
  slug: string;
  title: string;
  chapter: string;
  colour: Colour;
  tagline: string;
  description: string;
  posts: string[];
};

export type Guide = {
  slug: string;
  legacySlug: string;
  wooId: number;
  title: string;
  subtitle: string;
  shelf: string;
  colour: Colour;
  pages: string;
  audience: string;
  price: number;
  currency: string;
  image: string | null;
  imageAlt: string;
  description: string;
  html: string;
};

export type LegalPage = { slug: string; title: string; modified: string; html: string };

const shelves = (shelvesJson as { shelves: Shelf[] }).shelves;
const fallback = { posts: postsJson as Post[], guides: guidesJson as Guide[], pages: pagesJson as LegalPage[] };

async function content() {
  if (!hasSanity) return fallback;
  const { loadContent } = await import("@/lib/sanity/load");
  return loadContent();
}

// The five shelves are the site's structure, so they stay in code.
export function getShelves(): Shelf[] {
  return shelves;
}

export function getShelf(slug: string): Shelf | undefined {
  return shelves.find((s) => s.slug === slug);
}

export async function getPosts(): Promise<Post[]> {
  return (await content()).posts;
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}

export async function getPostsForShelf(shelfSlug: string): Promise<Post[]> {
  return (await getPosts()).filter((p) => p.shelf === shelfSlug);
}

export async function getLatestPosts(n = 3): Promise<Post[]> {
  return (await getPosts()).slice(0, n);
}

export async function getAdjacentPosts(slug: string): Promise<{ prev?: Post; next?: Post }> {
  const post = await getPost(slug);
  if (!post) return {};
  const onShelf = await getPostsForShelf(post.shelf);
  const i = onShelf.findIndex((p) => p.slug === slug);
  return { prev: onShelf[i + 1], next: onShelf[i - 1] };
}

export async function getGuides(): Promise<Guide[]> {
  return (await content()).guides;
}

export async function getGuide(slug: string): Promise<Guide | undefined> {
  return (await getGuides()).find((g) => g.slug === slug);
}

export async function getGuidesForShelf(shelfSlug: string): Promise<Guide[]> {
  return (await getGuides()).filter((g) => g.shelf === shelfSlug);
}

export async function getLegalPages(): Promise<LegalPage[]> {
  return (await content()).pages;
}

export async function getLegalPage(slug: string): Promise<LegalPage | undefined> {
  return (await getLegalPages()).find((p) => p.slug === slug);
}
