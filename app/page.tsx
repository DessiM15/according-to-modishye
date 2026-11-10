import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Shelf, type ShelfSummary } from "@/components/Shelf";
import { GuideCard } from "@/components/GuideCard";
import { BookCover } from "@/components/BookCover";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { Newsletter } from "@/components/Newsletter";
import { ExternalLink } from "@/components/ExternalLink";
import { ArticleCard } from "@/components/ArticleCard";
import { RoadMap, type RoadStop } from "@/components/RoadMap";
import { SectionHeader } from "@/components/SectionHeader";
import { getGuides, getPosts, getShelf, getShelves } from "@/lib/content";
import { colours, site } from "@/lib/site";

const doors = [
  { title: "Applying this year", body: "Six steps from senior year to a freshman dorm, and how to ask a professor for a recommendation that lands.", href: "/library/getting-into-college", colour: "gold" as const, label: "Shelf 02" },
  { title: "First year, far from home", body: "Homesickness, roommates, deadlines, and the three apps that got her through.", href: "/library/surviving-college", colour: "lavender" as const, label: "Shelf 03" },
  { title: "Parent of an only child", body: "The book was written for your kid. Start with why she wrote it.", href: "/the-solo-scholar", colour: "magenta" as const, label: "The book" },
];

export default async function HomePage() {
  const shelves = getShelves();
  const [posts, guides] = await Promise.all([getPosts(), getGuides()]);
  const summaries: ShelfSummary[] = shelves.map((s) => ({
    slug: s.slug,
    title: s.title,
    chapter: s.chapter,
    colour: s.colour,
    tagline: s.tagline,
    description: s.description,
    posts: posts.filter((p) => p.shelf === s.slug).map((p) => ({ slug: p.slug, title: p.title, readingMinutes: p.readingMinutes, video: Boolean(p.video) })),
    guides: guides.filter((g) => g.shelf === s.slug).map((g) => ({ slug: g.slug, title: g.title, price: g.price })),
  }));
  const latest = posts.slice(0, 3);

  const stops: RoadStop[] = [
    { when: "Nigeria", colour: shelves[0].colour, body: "Boarding school. Classes of ten to fifteen. The first lessons in resilience, favoritism and speaking up." },
    { when: "July 2013", colour: shelves[1].colour, body: "Lands in Houston with a few weeks to choose a school. Enrols at Bellaire High School as a sophomore." },
    { when: "2015", colour: shelves[2].colour, body: "Graduates at sixteen, on time, after making up a lost year." },
    { when: "Undergrad", colour: shelves[3].colour, body: "Community college, then private college, studying economics. A law internship in the last semester." },
    { when: "2019 to now", colour: shelves[4].colour, body: "Starts the blog and the YouTube channel. Writes The Solo Scholar, published January 2025." },
  ];

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
        <SectionHeader
          eyebrow="The library"
          id="library-title"
          title="Pull a book off the shelf."
          intro="Five shelves, one for each chapter of the road from boarding school to graduate school. Pick the chapter you are living and the articles for it appear underneath."
        />
        <div className="mt-12">
          <Shelf shelves={summaries} />
        </div>
      </section>

      <section aria-labelledby="story-title" className="container mt-24">
        <SectionHeader
          eyebrow="Her story"
          id="story-title"
          title="Three passports. One road to college."
          intro="Nigerian, Namibian and South African. An only child. She did the transition this site is about, and she wrote it all down."
          action={
            <Link href="/about" className="btn">
              Read her story
            </Link>
          }
        />
        <div className="mt-6">
          <RoadMap stops={stops} />
        </div>
      </section>

      <section aria-labelledby="book-title" className="mt-24 bg-ink py-16 text-paper on-dark sm:py-24">
        <div className="container grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <div className="mx-auto w-[min(62vw,16rem)] md:w-full md:max-w-[17rem]">
            <BookCover />
          </div>
          <div className="text-center md:text-left">
            <p className="hand !text-gold">The book · Paperback and Kindle</p>
            <h2 id="book-title" className="mt-2 text-3xl font-semibold">
              {site.book.title}: {site.book.subtitle}
            </h2>
            <p className="mx-auto mt-5 max-w-[56ch] text-lg text-paper/85 md:mx-0">
              Year by year, freshman to senior, for the student with no older sibling to ask. Homesickness, roommates, professors, and how each year sets up the next. Written across 2024 from her own road through community college and private college.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
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

      <section aria-labelledby="guides-title" className="container mt-24">
        <SectionHeader
          eyebrow="Guides · PDF downloads"
          id="guides-title"
          title="The checklists she wishes someone had handed her."
          action={
            <Link href="/guides" className="btn btn-ghost">
              All guides
            </Link>
          }
        />
        <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {guides.map((g) => (
            <li key={g.slug}>
              <GuideCard guide={g} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="latest-title" className="container mt-24">
        <SectionHeader
          eyebrow="New on the shelves"
          id="latest-title"
          title="Latest articles"
          action={
            <Link href="/library" className="btn btn-ghost">
              Open the library
            </Link>
          }
        />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((p) => (
            <li key={p.slug}>
              <ArticleCard post={p} shelf={getShelf(p.shelf)} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="video-title" className="container mt-24">
        <SectionHeader
          eyebrow="On YouTube"
          id="video-title"
          title="The same story, told out loud."
          intro="How she made up a lost year and graduated high school at sixteen. The channel covers boarding school, high school, community college and university."
          action={
            <ExternalLink href={site.social.youtube} className="btn">
              Subscribe on YouTube
            </ExternalLink>
          }
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <YouTubeEmbed id="FdWgk05oDfQ" title="How I graduated high school at 16 after moving back to the US" />
        </div>
      </section>

      <div className="mt-24">
        <Newsletter />
      </div>
    </>
  );
}
