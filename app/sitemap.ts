import type { MetadataRoute } from "next";
import { getGuides, getLegalPages, getPosts, getShelves } from "@/lib/content";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (p: string) => new URL(p, site.url).toString();
  const [posts, guides, pages] = await Promise.all([getPosts(), getGuides(), getLegalPages()]);
  const newest = posts[0]?.modified ?? "2025-01-01";
  return [
    { url: url("/"), lastModified: newest, changeFrequency: "weekly", priority: 1 },
    { url: url("/library"), lastModified: newest, changeFrequency: "weekly", priority: 0.9 },
    ...getShelves().map((s) => ({ url: url(`/library/${s.slug}`), lastModified: newest, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...posts.map((p) => ({ url: url(`/articles/${p.slug}`), lastModified: p.modified, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: url("/guides"), lastModified: newest, changeFrequency: "monthly", priority: 0.8 },
    ...guides.map((g) => ({ url: url(`/guides/${g.slug}`), lastModified: newest, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: url("/the-solo-scholar"), lastModified: newest, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/about"), lastModified: newest, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/contact"), lastModified: newest, changeFrequency: "yearly", priority: 0.4 },
    { url: url("/accessibility"), lastModified: newest, changeFrequency: "yearly", priority: 0.2 },
    ...pages.map((p) => ({ url: url(`/${p.slug}`), lastModified: p.modified, changeFrequency: "yearly" as const, priority: 0.1 })),
  ];
}
