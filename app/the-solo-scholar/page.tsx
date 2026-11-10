import type { Metadata } from "next";
import Link from "next/link";
import { BookCover } from "@/components/BookCover";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ExternalLink } from "@/components/ExternalLink";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { ArticleCard } from "@/components/ArticleCard";
import { OpenBook, type BookPage } from "@/components/OpenBook";
import { SectionHeader } from "@/components/SectionHeader";
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

// Drafted from her own description of the book. She should confirm the wording against the final chapters.
const pages: BookPage[] = [
  { label: "Year one", title: "Freshman: the foundation", body: "The chapter that took the longest to write, because every later year depends on it. Homesickness, the first roommate, the first professor you have to email, and the habits that make the next three years lighter." },
  { label: "Year two", title: "Sophomore: finding your footing", body: "The novelty wears off and the routines have to hold. Choosing a direction, using campus resources on purpose, and handling the stereotypes people carry about only children." },
  { label: "Year three", title: "Junior: building the record", body: "Relationships with professors start paying off: recommendations, research, references. The year to turn independence into a track record other people can see." },
  { label: "Year four", title: "Senior: the exit plan", body: "Turning four years into what comes next. Internships, applications, and leaving college with more than a degree." },
];

export default function BookPage() {
  const why = getPost("the-solo-scholar-only-children-in-college");
  const freshman = getPost("only-child-in-college");
  return (
    <>
      <div className="container pt-8">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "The Solo Scholar" }]} />
      </div>

      <section className="container mt-8 grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <div className="mx-auto w-[min(62vw,17rem)] md:w-full md:max-w-[19rem]">
          <BookCover priority />
        </div>
        <div className="text-center md:text-left">
          <p className="hand">The book · Published January 2025</p>
          <h1 className="mt-2 text-3xl font-semibold">
            {site.book.title}: {site.book.subtitle}
          </h1>
          <p className="mx-auto mt-5 max-w-[56ch] text-lg text-ink-2 md:mx-0">
            College asks you to share a room, ask strangers for help and manage your own time, often for the first time. If you grew up without siblings, that is a bigger jump than people admit. This book walks through all four years with the only child in mind.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
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
        <SectionHeader eyebrow="Open it up" id="inside-title" title="What is inside" />
        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {inside.map((it, i) => (
            <li key={i} className="catalogue-card p-6 text-center">
              <p className="hand">0{i + 1}</p>
              <p className="display mt-1 text-xl font-semibold">{it.title}</p>
              <p className="mt-2 text-ink-2">{it.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="chapters-title" className="container mt-24">
        <SectionHeader
          eyebrow="Turn the pages"
          id="chapters-title"
          title="Four years, four chapters"
          intro="Written between January and August 2024, then revised until it was right. Use the bookmarks or turn the page."
        />
        <div className="mx-auto mt-10 max-w-4xl">
          <OpenBook pages={pages} />
        </div>
      </section>

      {freshman && (
        <section aria-labelledby="sample-title" className="container mt-24">
          <SectionHeader eyebrow="Free sample of the voice" id="sample-title" title="Start with the freshman year article" />
          <div className="mx-auto mt-10 max-w-md">
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
