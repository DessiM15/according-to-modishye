// Content layer. Today this reads the JSON produced by scripts/import-wp.mjs.
// At launch the same functions read from the Sanity CMS so pages do not change.
import postsJson from "@/content/posts.json";
import guidesJson from "@/content/guides.json";
import pagesJson from "@/content/pages.json";
import shelvesJson from "@/content/shelves.json";
import type { Colour } from "@/lib/site";

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
  shopifyHandle: string | null;
};

export type LegalPage = { slug: string; title: string; modified: string; html: string };

const posts = postsJson as Post[];
const guides = guidesJson as Guide[];
const pages = pagesJson as LegalPage[];
const shelves = (shelvesJson as { shelves: Shelf[] }).shelves;

export function getShelves(): Shelf[] {
  return shelves;
}

export function getShelf(slug: string): Shelf | undefined {
  return shelves.find((s) => s.slug === slug);
}

export function getPosts(): Post[] {
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsForShelf(shelfSlug: string): Post[] {
  return posts.filter((p) => p.shelf === shelfSlug);
}

export function getLatestPosts(n = 3): Post[] {
  return posts.slice(0, n);
}

export function getAdjacentPosts(slug: string): { prev?: Post; next?: Post } {
  const post = getPost(slug);
  if (!post) return {};
  const onShelf = getPostsForShelf(post.shelf);
  const i = onShelf.findIndex((p) => p.slug === slug);
  return { prev: onShelf[i + 1], next: onShelf[i - 1] };
}

export function getGuides(): Guide[] {
  return guides;
}

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export function getGuidesForShelf(shelfSlug: string): Guide[] {
  return guides.filter((g) => g.shelf === shelfSlug);
}

export function getLegalPages(): LegalPage[] {
  return pages;
}

export function getLegalPage(slug: string): LegalPage | undefined {
  return pages.find((p) => p.slug === slug);
}
