import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/ArticleCard";
import { BuyButton } from "@/components/BuyButton";
import { GuideCard } from "@/components/GuideCard";
import { JsonLd } from "@/components/JsonLd";
import { getGuide, getGuides, getPostsForShelf, getShelf } from "@/lib/content";
import { breadcrumbLd, graph, productLd } from "@/lib/seo";
import { colours } from "@/lib/site";

export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getGuides()).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const guide = await getGuide((await params).slug);
  if (!guide) return {};
  return {
    title: `${guide.title}: ${guide.subtitle}`,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: { type: "website", title: `${guide.title}: ${guide.subtitle}`, description: guide.description, images: guide.image ? [guide.image] : undefined },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = await getGuide((await params).slug);
  if (!guide) notFound();
  const shelf = getShelf(guide.shelf);
  const related = (await getPostsForShelf(guide.shelf)).slice(0, 3);
  const others = (await getGuides()).filter((g) => g.slug !== guide.slug).slice(0, 4);
  const c = colours[guide.colour];

  return (
    <>
      <div className="container pt-8">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Guides", href: "/guides" }, { name: guide.title }]} />
      </div>

      <article className="container mt-8">
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div className="mx-auto w-full max-w-sm md:sticky md:top-24">
            <div className="relative aspect-[3/4] overflow-hidden rounded-r-xl rounded-l-md border border-ink/10 p-4 shadow-[inset_8px_0_0_rgba(255,255,255,.4),14px_16px_34px_-18px_rgba(26,25,23,.8)]" style={{ background: c.hex }}>
              {guide.image && (
                <div className="relative h-full w-full overflow-hidden rounded-md bg-white shadow-card">
                  <Image src={guide.image} alt={guide.imageAlt} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-contain" priority />
                </div>
              )}
            </div>
          </div>

          <div>
            {shelf && (
              <Link href={`/library/${shelf.slug}`} className="stamp no-underline" style={{ background: colours[shelf.colour].hex, color: colours[shelf.colour].ink, borderColor: "transparent" }}>
                {shelf.chapter} · {shelf.title}
              </Link>
            )}
            <h1 className="mt-5 text-3xl font-semibold">{guide.title}</h1>
            <p className="mt-2 text-xl text-ink-2">{guide.subtitle}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <p className="display text-2xl font-semibold">${guide.price}</p>
              <p className="font-mono text-sm text-ink-3">{guide.currency} · instant PDF</p>
            </div>
            <div className="mt-5">
              <BuyButton title={guide.title} price={guide.price} wooId={guide.wooId || null} />
            </div>

            <div className="prose mt-10" dangerouslySetInnerHTML={{ __html: guide.html }} />

            <dl className="mt-10 grid gap-6 rounded-card border border-line bg-white p-6 text-center shadow-card sm:grid-cols-3 sm:gap-4">
              <div>
                <dt className="eyebrow">Format</dt>
                <dd className="mt-1 font-medium">{guide.pages}</dd>
              </div>
              <div>
                <dt className="eyebrow">Made for</dt>
                <dd className="mt-1 font-medium">{guide.audience}</dd>
              </div>
              <div>
                <dt className="eyebrow">Delivery</dt>
                <dd className="mt-1 font-medium">Emailed right after checkout</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-ink-3">
              Digital products are not refundable once downloaded. See the <Link href="/refunds" className="text-ink">refund terms</Link>.
            </p>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="container mt-24">
          <p className="eyebrow">Read first, free</p>
          <h2 id="related-title" className="mt-2 text-2xl font-semibold">
            Articles from the same shelf
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <ArticleCard post={p} shelf={shelf} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="others-title" className="container mt-24">
        <h2 id="others-title" className="eyebrow">
          Other guides
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4">
          {others.map((g) => (
            <li key={g.slug}>
              <GuideCard guide={g} />
            </li>
          ))}
        </ul>
      </section>

      <JsonLd data={graph(productLd(guide), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: guide.title, path: `/guides/${guide.slug}` }]))} />
    </>
  );
}
