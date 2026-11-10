import Link from "next/link";
import { Hero } from "@/components/Hero";
import { LibraryShelf, type ShelfSummary } from "@/components/LibraryShelf";
import { GuideCard } from "@/components/GuideCard";
import { BookCover } from "@/components/BookCover";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { Newsletter } from "@/components/Newsletter";
import { ExternalLink } from "@/components/ExternalLink";
import { ArticleCard } from "@/components/ArticleCard";
import { getGuides, getGuidesForShelf, getLatestPosts, getPostsForShelf, getShelf, getShelves } from "@/lib/content";
import { colours, site } from "@/lib/site";

const doors = [
  { title: "Applying this year", body: "Six steps from senior year to a freshman dorm, and how to ask a professor for a recommendation that lands.", href: "/library/getting-into-college", colour: "gold" as const, label: "Shelf 02" },
  { title: "First year, far from home", body: "Homesickness, roommates, deadlines, and the three apps that got her through.", href: "/library/surviving-college", colour: "lavender" as const, label: "Shelf 03" },
  { title: "Parent of an only child", body: "The book was written for your kid. Start with why she wrote it.", href: "/the-solo-scholar", colour: "magenta" as const, label: "The book" },
];

const stops = [
  { when: "Nigeria", what: "Boarding school. Classes of ten to fifteen. The first lessons in resilience, favoritism and speaking up." },
  { when: "July 2013", what: "Lands in Houston with a few weeks to choose a school. Enrols at Bellaire High School as a sophomore." },
  { when: "2015", what: "Graduates at sixteen, on time, after making up a lost year." },
  { when: "Undergrad", what: "Community college, then private college, studying economics. A law internship in the last semester." },
  { when: "2019 to now", what: "Starts the blog and the YouTube channel. Writes The Solo Scholar, published January 2025." },
];

export default function HomePage() {
  const shelves = getShelves();
  const summaries: ShelfSummary[] = shelves.map((s) => ({
    slug: s.slug,
    title: s.title,
    chapter: s.chapter,
    colour: s.colour,
    tagline: s.tagline,
    description: s.description,
    posts: getPostsForShelf(s.slug).map((p) => ({ slug: p.slug, title: p.title, readingMinutes: p.readingMinutes, video: Boolean(p.video) })),
    guides: getGuidesForShelf(s.slug).map((g) => ({ slug: g.slug, title: g.title, price: g.price })),
  }));
  const guides = getGuides();
  const latest = getLatestPosts(3);

  return (
    <>
      <Hero shelves={shelves} />

      <section aria-labelledby="doors-title" className="container mt-6 sm:mt-10">
        <h2 id="doors-title" className="sr-only">
          Start where you are
        </h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {doors.map((d) => (
            <li key={d.href}>
              <Link href={d.href} className="group flex h-full flex-col rounded-card border-2 border-ink p-6 no-underline shadow-[4px_4px_0_#1a1917] transition-transform hover:-translate-y-1" style={{ background: colours[d.colour].hex, color: colours[d.colour].ink }}>
                <span className="eyebrow !text-current opacity-90">{d.label}</span>
                <span className="display mt-2 text-xl font-semibold group-hover:underline decoration-2 underline-offset-4">{d.title}</span>
                <span className="mt-2">{d.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="library-title" className="container mt-24">
        <div className="max-w-2xl">
          <p className="eyebrow">The library</p>
          <h2 id="library-title" className="mt-2 text-3xl font-semibold">
            Pull a book off the shelf.
          </h2>
          <p className="mt-4 text-lg text-ink-2">
            Five shelves, one for each chapter of the road from boarding school to graduate school. Pick the chapter you are living and the articles for it appear underneath.
          </p>
        </div>
        <div className="mt-10">
          <LibraryShelf shelves={summaries} />
        </div>
      </section>

      <section aria-labelledby="book-title" className="mt-24 bg-ink py-16 text-paper on-dark sm:py-24">
        <div className="container grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div className="mx-auto w-[min(70vw,18rem)] text-[clamp(1rem,0.6rem+2vw,1.5rem)] md:w-full md:max-w-xs">
            <BookCover />
          </div>
          <div>
            <p className="eyebrow !text-paper/60">The book · Paperback and Kindle</p>
            <h2 id="book-title" className="mt-2 text-3xl font-semibold">
              {site.book.title}: {site.book.subtitle}
            </h2>
            <p className="mt-5 max-w-[56ch] text-lg text-paper/85">
              Year by year, freshman to senior, for the student with no older sibling to ask. Homesickness, roommates, professors, and how each year sets up the next. Written across 2024 from her own road through community college and private college.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ExternalLink href={site.book.amazon} className="btn btn-gold">
                Buy on Amazon
              </ExternalLink>
              <Link href="/the-solo-scholar" className="btn btn-ghost !border-paper !text-paper hover:!bg-paper hover:!text-ink">
                What is inside
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="story-title" className="container mt-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">Her story</p>
            <h2 id="story-title" className="mt-2 text-3xl font-semibold">
              Three passports. One road to college.
            </h2>
            <p className="mt-4 text-lg text-ink-2">
              Nigerian, Namibian and South African. An only child. She did the transition this site is about, and she wrote it all down.
            </p>
            <Link href="/about" className="btn mt-6">
              Read her story
            </Link>
          </div>
          <ol className="relative border-l-2 border-ink pl-6">
            {stops.map((s, i) => (
              <li key={i} className="relative pb-8 last:pb-0">
                <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-ink" style={{ background: colours[shelves[i].colour].hex }} aria-hidden="true" />
                <p className="font-mono text-xs tracking-[0.16em] uppercase text-ink-3">{s.when}</p>
                <p className="mt-1 text-ink">{s.what}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="guides-title" className="container mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="eyebrow">Guides · PDF downloads</p>
            <h2 id="guides-title" className="mt-2 text-3xl font-semibold">
              The checklists she wishes someone had handed her.
            </h2>
          </div>
          <Link href="/guides" className="btn btn-ghost">
            All guides
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {guides.map((g) => (
            <li key={g.slug}>
              <GuideCard guide={g} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="latest-title" className="container mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">New on the shelves</p>
            <h2 id="latest-title" className="mt-2 text-3xl font-semibold">
              Latest articles
            </h2>
          </div>
          <Link href="/library" className="btn btn-ghost">
            Open the library
          </Link>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((p) => (
            <li key={p.slug}>
              <ArticleCard post={p} shelf={getShelf(p.shelf)} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="video-title" className="container mt-24">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1.5fr]">
          <div>
            <p className="eyebrow">On YouTube</p>
            <h2 id="video-title" className="mt-2 text-3xl font-semibold">
              The same story, told out loud.
            </h2>
            <p className="mt-4 text-lg text-ink-2">
              How she made up a lost year and graduated high school at sixteen. The channel covers boarding school, high school, community college and university.
            </p>
            <ExternalLink href={site.social.youtube} className="btn mt-6">
              Subscribe on YouTube
            </ExternalLink>
          </div>
          <YouTubeEmbed id="FdWgk05oDfQ" title="How I graduated high school at 16 after moving back to the US" />
        </div>
      </section>

      <div className="mt-24">
        <Newsletter />
      </div>
    </>
  );
}
