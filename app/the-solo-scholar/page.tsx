import type { Metadata } from "next";
import Link from "next/link";
import { BookCover } from "@/components/BookCover";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ExternalLink } from "@/components/ExternalLink";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { ArticleCard } from "@/components/ArticleCard";
import { getPost, getShelf } from "@/lib/content";
import { bookLd, breadcrumbLd, graph } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Solo Scholar: Conquering College as an Only Child (book)",
  description:
    "A year-by-year guide to college for only children, by Yeyeside Talabi. Homesickness, roommates, professors and how each year sets up the next. Paperback and Kindle on Amazon.",
  alternates: { canonical: "/the-solo-scholar" },
};

const inside = [
  { title: "Homesickness, handled", body: "Practical ways to stay connected to home while building a life on campus." },
  { title: "Roommates", body: "How to communicate, set boundaries and resolve conflict when you have never shared a room before." },
  { title: "Professors are people", body: "Building relationships that pay off in recommendations, research and references." },
  { title: "Year by year", body: "Freshman, sophomore, junior, senior. Each chapter builds on the last so nothing catches you by surprise." },
];

const chapters = ["Freshman: the foundation year", "Sophomore: finding your footing", "Junior: building the record", "Senior: the exit plan"];

export default function BookPage() {
  const why = getPost("the-solo-scholar-only-children-in-college");
  const freshman = getPost("only-child-in-college");
  return (
    <>
      <div className="container pt-8">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "The Solo Scholar" }]} />
      </div>

      <section className="container mt-8 grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div className="mx-auto w-[min(70vw,20rem)] text-[clamp(1rem,0.6rem+2vw,1.6rem)] md:w-full md:max-w-sm">
          <BookCover />
        </div>
        <div>
          <p className="eyebrow">The book · Published January 2025</p>
          <h1 className="mt-2 text-3xl font-semibold">
            {site.book.title}: {site.book.subtitle}
          </h1>
          <p className="mt-5 text-lg text-ink-2">
            College asks you to share a room, ask strangers for help and manage your own time, often for the first time. If you grew up without siblings, that is a bigger jump than people admit. This book walks through all four years with the only child in mind.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ExternalLink href={site.book.amazon} className="btn btn-gold">
              Buy on Amazon
            </ExternalLink>
            {why && (
              <Link href={`/articles/${why.slug}`} className="btn btn-ghost">
                Why she wrote it
              </Link>
            )}
          </div>
          <p className="mt-4 font-mono text-xs text-ink-3">{site.book.formats.join(" · ")} · By {site.author.name}</p>
        </div>
      </section>

      <section aria-labelledby="inside-title" className="container mt-24">
        <h2 id="inside-title" className="text-2xl font-semibold">
          What is inside
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {inside.map((it, i) => (
            <li key={i} className="catalogue-card p-6">
              <p className="font-mono text-sm text-coral-deep">0{i + 1}</p>
              <p className="display mt-1 text-xl font-semibold">{it.title}</p>
              <p className="mt-2 text-ink-2">{it.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="chapters-title" className="container mt-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 id="chapters-title" className="text-2xl font-semibold">
              Four years, four chapters
            </h2>
            <p className="mt-3 text-ink-2">
              Written between January and August 2024, then revised until it was right. The freshman chapter took the longest, because that is the year everything else depends on.
            </p>
          </div>
          <ol className="divide-y divide-line border-y border-line">
            {chapters.map((c, i) => (
              <li key={i} className="flex items-baseline gap-4 py-4">
                <span className="font-mono text-sm text-ink-3">0{i + 1}</span>
                <span className="display text-xl">{c}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {freshman && (
        <section aria-labelledby="sample-title" className="container mt-24">
          <p className="eyebrow">Free sample of the voice</p>
          <h2 id="sample-title" className="mt-2 text-2xl font-semibold">
            Start with the freshman year article
          </h2>
          <div className="mt-8 max-w-md">
            <ArticleCard post={freshman} shelf={getShelf(freshman.shelf)} />
          </div>
        </section>
      )}

      <div className="mt-24">
        <Newsletter />
      </div>
      <JsonLd data={graph(bookLd(), breadcrumbLd([{ name: "Home", path: "/" }, { name: "The Solo Scholar", path: "/the-solo-scholar" }]))} />
    </>
  );
}
