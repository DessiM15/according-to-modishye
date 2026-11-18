import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ExternalLink } from "@/components/ExternalLink";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { SectionHeader } from "@/components/SectionHeader";
import { getPosts, getShelves } from "@/lib/content";
import { breadcrumbLd, graph, personLd } from "@/lib/seo";
import { colours, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Her story: Yeyeside Talabi, only child and author of The Solo Scholar",
  description:
    "Yeyeside Talabi is a writer and only child, born in the United States, with roots in Nigeria, Namibia and South Africa. She went to boarding school in Nigeria, graduated high school in Houston at 16, studied Economics, and wrote The Solo Scholar.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const shelves = getShelves();
  const posts = await getPosts();
  const find = (slug: string) => posts.find((p) => p.slug === slug);
  const link = (slug: string, text: string) => {
    const p = find(slug);
    return p ? (
      <Link href={`/articles/${p.slug}`} className="text-ink">
        {text}
      </Link>
    ) : (
      text
    );
  };

  const chapters = [
    {
      when: "Boarding school",
      colour: shelves[0].colour,
      title: "A boarding school with ten students in the senior arts class",
      body: (
        <>
          Yeyeside Talabi is an only child who grew up proud of a multicultural heritage: her mother speaks six languages. She was born in the United States and went to school there from kindergarten through sixth grade, then to boarding school in Nigeria, where classes were small and the social rules were not. Favoritism, bullying and finding your voice were the first subjects she learned there, and {link("how-to-survive-boarding-school-in-nigeria", "she still gets asked how to survive it")}.
        </>
      ),
    },
    {
      when: "July 2013",
      colour: shelves[1].colour,
      title: "Houston, with a few weeks to choose a school",
      body: (
        <>
          Leaving Nigeria felt abrupt. She arrived back in the United States in July 2013 and had weeks to sit an entrance exam and pick a school. She qualified for private schools and chose none of them. She enrolled at Bellaire High School as a sophomore, a year behind where she would have been in Nigeria. {link("moving-back-to-the-us-for-high-school", "She wrote about the missing period")} and made a video about how she made the year up.
        </>
      ),
    },
    {
      when: "2015",
      colour: shelves[2].colour,
      title: "Graduated at sixteen, on time",
      body: (
        <>
          Classes of 35 instead of 15. A magnet school where students go on to Columbia and Duke. She graduated in 2015 at sixteen, then found that college looked more like Nigeria than high school had: small rooms, professors who did not skip the roll call, and nobody checking your calendar for you. {link("only-child-in-college", "Freshman year as an only child")} is where the blog really begins.
        </>
      ),
    },
    {
      when: "Undergrad",
      colour: shelves[3].colour,
      title: "Community college, Grinnell, and an Economics degree",
      body: (
        <>
          Community college first, then private college. At Grinnell College in Iowa she learned that {link("its-not-you-change-your-environment", "sometimes it is not you, it is your environment")}, and acted on it. She studied Economics, took a professor&apos;s advice to {link("investing-for-beginners", "start investing early")}, and spent her last undergraduate semester {link("how-i-got-a-law-internship-as-an-undergraduate", "interning for an immigration lawyer")}.
        </>
      ),
    },
    {
      when: "2017 to now",
      colour: shelves[4].colour,
      title: "The channel, the blog, the book",
      body: (
        <>
          She started creating videos in 2017, then {link("why-did-i-start-blogging", "the blog followed in 2019")}, to reach other only children and to think clearly about her own road. In 2024 she wrote {site.book.title}: {site.book.subtitle}, published in January 2025 in paperback and Kindle. The guides in the shop are the checklists she used along the way.
        </>
      ),
    },
  ];

  const beliefs = [
    { title: "Favor is a skill", body: "Hard work alone is not the whole story. Learn to recognize favoritism and use it honestly.", slug: "how-to-use-favoritism-to-your-advantage" },
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
            Writer, YouTuber and author of The Solo Scholar. An only child, born in the United States, with roots in Nigeria, Namibia and South Africa. She went to boarding school in Nigeria, came back to Houston for high school, earned an Economics degree, and wrote down everything the road taught her so you do not have to learn it alone.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link href="/library" className="btn">
              Open the library
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Ask the help desk
            </Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[17rem] sm:max-w-xs">
          <div className="relative">
            <div className="absolute left-[10.5%] right-[13.5%] top-[4.5%] bottom-[8.5%] -z-10 rounded-full bg-lavender" aria-hidden="true" />
            <Image src="/images/modishye-portrait.png" alt="Illustration of Yeyeside: a woman with a full natural afro, gold hoop earrings and a lavender dress, resting her chin on her hand beside a stack of books, inside an oval frame of flowers and leaves" width={1122} height={1402} sizes="(min-width: 768px) 20rem, 70vw" className="h-auto w-full" priority />
          </div>
          <span className="stamp absolute -bottom-3 left-4 bg-paper text-ink">Only child · Two continents</span>
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
              {find(b.slug) && (
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
