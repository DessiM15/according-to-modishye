import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GuideCard } from "@/components/GuideCard";
import { BookCover } from "@/components/BookCover";
import { JsonLd } from "@/components/JsonLd";
import { ExternalLink } from "@/components/ExternalLink";
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
  { title: "Check out on Shopify", body: "Card, Apple Pay or Google Pay. Secure checkout, no account needed." },
  { title: "Download instantly", body: "The PDF lands in your email the moment the order goes through. Print it or keep it on your phone." },
];

export default function GuidesPage() {
  const guides = getGuides();
  const shelves = getShelves();
  return (
    <>
      <div className="container pt-8">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Guides" }]} />
        <div className="mt-6 max-w-3xl">
          <p className="eyebrow">{guides.length} guides · PDF downloads</p>
          <h1 className="mt-2 text-3xl font-semibold">Guides</h1>
          <p className="mt-4 text-lg text-ink-2">
            The checklists and track lists she built for herself, cleaned up so you can use them. Each one belongs to a shelf in the library.
          </p>
        </div>
      </div>

      <div className="container mt-12 space-y-20">
        {shelves
          .filter((s) => guides.some((g) => g.shelf === s.slug))
          .map((s) => (
            <section key={s.slug} aria-labelledby={`guides-${s.slug}`}>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="eyebrow">{s.chapter}</p>
                  <h2 id={`guides-${s.slug}`} className="mt-1 text-2xl font-semibold">
                    {s.title}
                  </h2>
                </div>
                <Link href={`/library/${s.slug}`} className="font-mono text-sm text-ink">
                  Read the shelf
                </Link>
              </div>
              <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
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
        <h2 id="how-title" className="eyebrow">
          How buying works
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={i} className="catalogue-card p-6">
              <p className="font-mono text-sm text-coral-deep">0{i + 1}</p>
              <p className="display mt-1 text-xl font-semibold">{s.title}</p>
              <p className="mt-2 text-ink-2">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="book-cta" className="container mt-24">
        <div className="grid items-center gap-8 rounded-card bg-ink p-8 text-paper on-dark md:grid-cols-[auto_1fr] sm:p-10">
          <div className="w-32 text-[0.8rem] sm:w-40">
            <BookCover />
          </div>
          <div>
            <p className="eyebrow !text-paper/60">Also on the shelf</p>
            <h2 id="book-cta" className="mt-2 text-2xl font-semibold">
              {site.book.title}: {site.book.subtitle}
            </h2>
            <p className="mt-3 max-w-[50ch] text-paper/85">The full book, year by year. Paperback and Kindle on Amazon.</p>
            <div className="mt-5 flex flex-wrap gap-3">
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
