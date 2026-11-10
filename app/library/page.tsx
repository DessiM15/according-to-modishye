import type { Metadata } from "next";
import Link from "next/link";
import { Bookcase } from "@/components/Bookcase";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { getPostsForShelf, getShelves } from "@/lib/content";
import { breadcrumbLd, graph } from "@/lib/seo";
import { colours } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Library: college advice shelved by the moment you are in",
  description:
    "Every Modishye article on one page. Five shelves: boarding school, getting into college, surviving college, money, and culture and voice. Written by Yeyeside Talabi.",
  alternates: { canonical: "/library" },
};

export default function LibraryPage() {
  const shelves = getShelves();
  const total = shelves.reduce((n, s) => n + getPostsForShelf(s.slug).length, 0);
  return (
    <>
      <div className="container pt-8">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Library" }]} />
        <div className="mt-6 max-w-3xl">
          <p className="eyebrow">
            {shelves.length} shelves · {total} titles
          </p>
          <h1 className="mt-2 text-3xl font-semibold">The Library</h1>
          <p className="mt-4 text-lg text-ink-2">
            Read in order and it is her story. Jump to a shelf and it is the help you need this week.
          </p>
        </div>
        <nav aria-label="Shelves on this page" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {shelves.map((s) => (
              <li key={s.slug}>
                <Link href={`#${s.slug}`} className="sticker !text-base !py-2" style={{ background: colours[s.colour].hex, color: colours[s.colour].ink }}>
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container mt-16 space-y-24">
        {shelves.map((s) => (
          <Bookcase key={s.slug} shelf={s} posts={getPostsForShelf(s.slug)} />
        ))}
      </div>

      <div className="mt-24">
        <Newsletter />
      </div>
      <JsonLd data={graph(breadcrumbLd([{ name: "Home", path: "/" }, { name: "Library", path: "/library" }]))} />
    </>
  );
}
