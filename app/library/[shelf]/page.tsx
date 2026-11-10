import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bookcase } from "@/components/Bookcase";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideCard } from "@/components/GuideCard";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { SectionHeader } from "@/components/SectionHeader";
import { getGuidesForShelf, getPostsForShelf, getShelf, getShelves } from "@/lib/content";
import { breadcrumbLd, collectionLd, graph } from "@/lib/seo";
import { colours } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getShelves().map((s) => ({ shelf: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ shelf: string }> }): Promise<Metadata> {
  const shelf = getShelf((await params).shelf);
  if (!shelf) return {};
  return {
    title: `${shelf.title}: ${shelf.tagline}`,
    description: shelf.description,
    alternates: { canonical: `/library/${shelf.slug}` },
  };
}

export default async function ShelfPage({ params }: { params: Promise<{ shelf: string }> }) {
  const shelf = getShelf((await params).shelf);
  if (!shelf) notFound();
  const posts = getPostsForShelf(shelf.slug);
  const guides = getGuidesForShelf(shelf.slug);
  const shelves = getShelves();
  const index = shelves.findIndex((s) => s.slug === shelf.slug);
  const prev = shelves[index - 1];
  const next = shelves[index + 1];

  return (
    <>
      <div className="container pt-8">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Library", href: "/library" }, { name: shelf.title }]} />
        <div className="mx-auto mt-8 max-w-2xl text-center">
          <p className="hand">
            {shelf.chapter} · {posts.length} {posts.length === 1 ? "title" : "titles"}
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            <span className="inline-block border-b-[6px]" style={{ borderColor: colours[shelf.colour].hex }}>
              {shelf.title}
            </span>
          </h1>
          <p className="mt-4 text-lg text-ink-2">{shelf.description}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {prev && (
              <Link href={`/library/${prev.slug}`} className="btn btn-ghost">
                Previous: {prev.title}
              </Link>
            )}
            {next && (
              <Link href={`/library/${next.slug}`} className="btn btn-ghost">
                Next: {next.title}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mt-12">
        <Bookcase shelf={shelf} posts={posts} showHeading={false} />
      </div>

      {guides.length > 0 && (
        <section aria-labelledby="shelf-guides" className="container mt-24">
          <SectionHeader eyebrow="Guides for this chapter" id="shelf-guides" title="Take the checklist with you" />
          <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {guides.map((g) => (
              <li key={g.slug}>
                <GuideCard guide={g} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-24">
        <Newsletter />
      </div>
      <JsonLd data={graph(collectionLd(shelf, posts), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Library", path: "/library" }, { name: shelf.title, path: `/library/${shelf.slug}` }]))} />
    </>
  );
}
