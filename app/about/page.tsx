import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ExternalLink } from "@/components/ExternalLink";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { RoadMap, type RoadStop } from "@/components/RoadMap";
import { SectionHeader } from "@/components/SectionHeader";
import { getPost, getShelves } from "@/lib/content";
import { breadcrumbLd, graph, personLd } from "@/lib/seo";
import { colours, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Her story: Yeyeside Talabi, from a Nigerian boarding school to a US degree",
  description:
    "Yeyeside Talabi is a Nigerian, Namibian and South African writer and only child. She left boarding school in Nigeria, graduated high school in Houston at 16, studied economics, and wrote The Solo Scholar.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const shelves = getShelves();
  const link = (slug: string, text: string) => {
    const p = getPost(slug);
    return p ? (
      <Link href={`/articles/${p.slug}`} className="text-ink">
        {text}
      </Link>
    ) : (
      text
    );
  };

  const stops: RoadStop[] = [
    { when: "Nigeria", title: "Boarding school", colour: shelves[0].colour, body: "Small classes, big social rules. Favoritism, bullying and finding her voice.", href: `/library/${shelves[0].slug}` },
    { when: "July 2013", title: "Houston", colour: shelves[1].colour, body: "Weeks to pick a school. Bellaire High School, starting as a sophomore.", href: `/library/${shelves[1].slug}` },
    { when: "2015", title: "Graduated at 16", colour: shelves[2].colour, body: "On time, after making up the lost year. Then community college.", href: `/library/${shelves[2].slug}` },
    { when: "Undergrad", title: "Economics", colour: shelves[3].colour, body: "Private college in Iowa, a professor's advice to invest early, a law internship.", href: `/library/${shelves[3].slug}` },
    { when: "2019 to now", title: "The blog, the channel, the book", colour: shelves[4].colour, body: "Writing for other only children. The Solo Scholar, published January 2025.", href: `/library/${shelves[4].slug}` },
  ];

  const chapters = [
    {
      when: "Nigeria",
      colour: shelves[0].colour,
      title: "A boarding school with ten students in the senior arts class",
      body: (
        <>
          Yeyeside Talabi grew up an only child with three passports: Nigerian, Namibian and South African. Her mother speaks six languages. School was a boarding school in Nigeria, where classes were small and the social rules were not. Favoritism, bullying and finding your voice were the first subjects she learned, and {link("how-to-survive-boarding-school-in-nigeria", "she still gets asked how to survive it")}.
        </>
      ),
    },
    {
      when: "July 2013",
      colour: shelves[1].colour,
      title: "Houston, with a few weeks to choose a school",
      body: (
        <>
          Leaving Nigeria felt abrupt. She arrived in the United States in July 2013 and had weeks to sit an entrance exam and pick a school. She qualified for private schools and chose none of them. She enrolled at Bellaire High School as a sophomore, a year behind where she would have been in Nigeria. {link("moving-back-to-the-us-for-high-school", "She wrote about the missing period")} and made a video about how she made the year up.
        </>
      ),
    },
    {
      when: "2015",
      colour: shelves[2].colour,
      title: "Graduated at sixteen, on time",
      body: (
        <>
          Classes of 35 instead of 15. A magnet school where students go on to Columbia and Duke. She graduated in 2015 at sixteen, then found that college looked more like Nigeria than high school had: small rooms, professors who skip the roll call, and nobody checking your calendar for you. {link("only-child-in-college", "Freshman year as an only child")} is where the blog really begins.
        </>
      ),
    },
    {
      when: "Undergrad",
      colour: shelves[3].colour,
      title: "Community college, Grinnell, and an economics degree",
      body: (
        <>
          Community college first, then private college. At Grinnell College in Iowa she learned that {link("its-not-you-change-your-environment", "sometimes it is not you, it is your environment")}, and acted on it. She studied economics, took a professor&apos;s advice to {link("investing-for-beginners", "start investing early")}, and spent her last undergraduate semester {link("how-i-got-a-law-internship-as-an-undergraduate", "interning for an immigration lawyer")}.
        </>
      ),
    },
    {
      when: "2019 to now",
      colour: shelves[4].colour,
      title: "The blog, the channel, the book",
      body: (
        <>
          She {link("why-did-i-start-blogging", "started writing in 2019")} to reach other only children and to think clearly about her own road. The YouTube channel followed. In 2024 she wrote {site.book.title}: {site.book.subtitle}, published in January 2025 in paperback and Kindle. The guides in the shop are the checklists she used along the way.
        </>
      ),
    },
  ];

  const beliefs = [
    { title: "Favor is a skill", body: "Hard work alone is not the whole story. Learn to recognise favoritism and use it honestly.", slug: "how-to-use-favoritism-to-your-advantage" },
    { title: "Change your environment", body: "If the place is wrong, the problem is not always you. Move.", slug: "its-not-you-change-your-environment" },
    { title: "Raise your voice", body: "Gather the facts, then say the thing. Observers do not get heard.", slug: "raise-your-voice" },
  ];

  return (
    <>
      <div className="container pt-8">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Her story" }]} />
      </div>

      <section className="container mt-8 grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <div className="text-center md:text-left">
          <p className="hand">Her story</p>
          <h1 className="mt-2 text-3xl font-semibold">Yeyeside Talabi</h1>
          <p className="mx-auto mt-5 max-w-[56ch] text-lg text-ink-2 md:mx-0">
            Writer, YouTuber and author of The Solo Scholar. Nigerian, Namibian and South African. An only child who went from a boarding school in Nigeria to a US economics degree, and wrote down everything the road taught her so you do not have to learn it alone.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link href="/library" className="btn">
              Open the library
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Say hello
            </Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[17rem] sm:max-w-xs">
          <div className="relative">
            <div className="absolute inset-x-[16%] top-[13%] bottom-[9%] -z-10 rounded-[50%] bg-lavender" aria-hidden="true" />
            <Image src="/images/modishye-frame.png" alt="According to Modishye illustration: a woman in profile with natural hair, framed by an arch of flowers and leaves" width={875} height={1400} sizes="(min-width: 768px) 20rem, 70vw" className="h-auto w-full" priority />
          </div>
          <span className="stamp absolute -bottom-3 left-4 bg-paper text-ink">Only child · 3 passports</span>
        </div>
      </section>

      <section aria-labelledby="road-title" className="container mt-24">
        <SectionHeader eyebrow="The road so far" id="road-title" title="Five stops, five shelves" intro="The library is organised the way her life was. Follow the road, then read the chapter that matches where you are." />
        <div className="mt-4">
          <RoadMap stops={stops} endLabel="Today" />
        </div>
      </section>

      <section aria-labelledby="chapters-title" className="container mt-24">
        <SectionHeader eyebrow="In full" id="chapters-title" title="The long version" />
        <ol className="mx-auto mt-12 max-w-4xl space-y-10">
          {chapters.map((c, i) => (
            <li key={i} className="grid gap-4 md:grid-cols-[10rem_1fr] md:gap-10">
              <div>
                <span className="stamp" style={{ background: colours[c.colour].hex, color: colours[c.colour].ink, borderColor: "transparent" }}>
                  {c.when}
                </span>
              </div>
              <div className="max-w-[62ch]">
                <h3 className="text-xl font-semibold">{c.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-ink-2">{c.body}</p>
                <Link href={`/library/${shelves[i].slug}`} className="mt-3 inline-block font-mono text-sm text-ink">
                  Shelf 0{i + 1}: {shelves[i].title}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="beliefs-title" className="container mt-24">
        <SectionHeader eyebrow="On repeat" id="beliefs-title" title="Three things she keeps saying" />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {beliefs.map((b, i) => (
            <li key={i} className="catalogue-card p-6 text-center">
              <p className="display text-xl font-semibold">{b.title}</p>
              <p className="mt-2 text-ink-2">{b.body}</p>
              {getPost(b.slug) && (
                <Link href={`/articles/${b.slug}`} className="mt-4 inline-block font-mono text-sm text-ink">
                  Read the article
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="find-title" className="container mt-24">
        <SectionHeader eyebrow="Say hi" id="find-title" title="Where to find her" />
        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          <li>
            <ExternalLink href={site.social.youtube} className="sticker bg-coral">
              YouTube
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href={site.social.x} className="sticker bg-gold">
              X
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href={site.social.snapchat} className="sticker bg-mint">
              Snapchat
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href={site.book.amazon} className="sticker bg-magenta !text-black">
              The book on Amazon
            </ExternalLink>
          </li>
          <li>
            <a href={`mailto:${site.email}`} className="sticker bg-lavender">
              Email
            </a>
          </li>
        </ul>
      </section>

      <div className="mt-24">
        <Newsletter />
      </div>
      <JsonLd data={graph(personLd(), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Her story", path: "/about" }]))} />
    </>
  );
}
