import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideCard } from "@/components/GuideCard";
import { BookCover } from "@/components/BookCover";
import { JsonLd } from "@/components/JsonLd";
import { ExternalLink } from "@/components/ExternalLink";
import { SectionHeader } from "@/components/SectionHeader";
import { getGuides, getShelves } from "@/lib/content";
import { breadcrumbLd, graph, productLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guides: PDF checklists for college applications, first year and grad school",
  description:
    "Six digital guides by Yeyeside Talabi: the six-step college application route, a recommendation letter checklist, a homesickness survival guide, and weekly track lists for working graduate students.",
  alternates: { canonical: "/guides" },
};

const steps = [
  { title: "Pick a guide", body: "Each one is a short PDF built around a single moment: applying, arriving, asking, or balancing work and class." },
  { title: "Check out", body: "The button opens secure checkout in a new tab with the guide already in your cart." },
  { title: "Download instantly", body: "The PDF lands in your email the moment the order goes through. Print it or keep it on your phone." },
];

export default async function GuidesPage() {
  const guides = await getGuides();
  const shelves = getShelves();
  return (
    <>
      <div className="container pt-8">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Guides" }]} />
        <div className="mt-8">
          <SectionHeader as="h1" eyebrow={`${guides.length} guides · PDF downloads`} title="Guides" intro="The checklists and track lists she built for herself, cleaned up so you can use them. Each one belongs to a shelf in the library." />
        </div>
      </div>

      <div className="container mt-16 space-y-24">
        {shelves
          .filter((s) => guides.some((g) => g.shelf === s.slug))
          .map((s) => (
            <section key={s.slug} aria-labelledby={`guides-${s.slug}`}>
              <SectionHeader
                eyebrow={s.chapter}
                id={`guides-${s.slug}`}
                title={s.title}
                action={
                  <Link href={`/library/${s.slug}`} className="btn btn-ghost">
                    Read the shelf
                  </Link>
                }
              />
              <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {guides
                  .filter((g) => g.shelf === s.slug)
                  .map((g) => (
                    <li key={g.slug}>
                      <GuideCard guide={g} />
                    </li>
                  ))}
              </ul>
            </section>
          ))}
      </div>

      <section aria-labelledby="how-title" className="container mt-24">
        <SectionHeader eyebrow="Three steps" id="how-title" title="How buying works" />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={i} className="catalogue-card p-6 text-center">
              <p className="hand">0{i + 1}</p>
              <p className="display mt-1 text-xl font-semibold">{s.title}</p>
              <p className="mt-2 text-ink-2">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="book-cta" className="container mt-24">
        <div className="grid items-center gap-8 rounded-card bg-ink p-8 text-paper on-dark sm:p-10 md:grid-cols-[auto_1fr]">
          <div className="mx-auto w-36 sm:w-44">
            <BookCover />
          </div>
          <div className="text-center md:text-left">
            <p className="hand !text-gold">Also on the shelf</p>
            <h2 id="book-cta" className="mt-2 text-2xl font-semibold">
              {site.book.title}: {site.book.subtitle}
            </h2>
            <p className="mx-auto mt-3 max-w-[50ch] text-paper/85 md:mx-0">The full book, year by year. Paperback and Kindle on Amazon.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
              <ExternalLink href={site.book.amazon} className="btn btn-gold">
                Buy on Amazon
              </ExternalLink>
              <Link href="/the-solo-scholar" className="btn btn-ghost !border-paper !text-paper hover:!bg-paper hover:!text-ink">
                About the book
              </Link>
            </div>
          </div>
        </div>
      </section>

      <JsonLd data={graph(breadcrumbLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }]), ...guides.map(productLd))} />
    </>
  );
}
