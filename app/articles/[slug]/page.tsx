import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/ArticleCard";
import { GuideCard } from "@/components/GuideCard";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { getAdjacentPosts, getGuidesForShelf, getPost, getPosts, getShelf } from "@/lib/content";
import { articleLd, breadcrumbLd, graph } from "@/lib/seo";
import { colours, formatDate, site } from "@/lib/site";

// New articles published in the portal render on first visit without a redeploy.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const shelf = getShelf(post.shelf);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/articles/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [`${site.url}/about`],
      section: shelf?.title,
      url: `/articles/${post.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const shelf = getShelf(post.shelf);
  const { prev, next } = await getAdjacentPosts(post.slug);
  const guides = (await getGuidesForShelf(post.shelf)).slice(0, 2);
  const colour = shelf ? colours[shelf.colour] : colours.gold;

  return (
    <>
      <article>
        <header className="container pt-8">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Library", href: "/library" }, ...(shelf ? [{ name: shelf.title, href: `/library/${shelf.slug}` }] : []), { name: post.title }]} />
          <div className="mx-auto mt-8 max-w-3xl">
            {shelf && (
              <Link href={`/library/${shelf.slug}`} className="stamp no-underline" style={{ background: colour.hex, color: colour.ink, borderColor: "transparent" }}>
                {shelf.chapter} · {shelf.title}
              </Link>
            )}
            <h1 className="mt-5 text-3xl font-semibold">{post.title}</h1>
            <p className="mt-5 font-mono text-sm text-ink-3">
              By <Link href="/about" className="text-ink">{site.author.name}</Link> · <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read
              {post.modified !== post.date && <> · Updated <time dateTime={post.modified}>{formatDate(post.modified)}</time></>}
            </p>
          </div>
          {post.cover && (
            <div className="mx-auto mt-8 max-w-4xl">
              <div className="relative aspect-[1.9/1] overflow-hidden rounded-card bg-paper-2 shadow-card">
                <Image src={post.cover} alt={post.coverAlt} fill sizes="(min-width: 1024px) 56rem, 100vw" className="object-cover" priority />
              </div>
            </div>
          )}
        </header>

        <div className="container mt-10">
          <div className="mx-auto max-w-3xl">
            {post.video && (
              <div className="mb-10">
                <YouTubeEmbed id={post.video} title={post.title} />
              </div>
            )}
            {post.words < 40 && !post.video ? (
              <p className="rounded-lg border border-line bg-paper-2 p-4 text-ink-2">This piece was published as an image on the old site. The text version is being added.</p>
            ) : null}
            {/* Article HTML comes from our own importer, cleaned to plain semantic tags. */}
            <div className="prose mx-auto" dangerouslySetInnerHTML={{ __html: post.html }} />
          </div>
        </div>

        <footer className="container mt-16">
          <div className="mx-auto max-w-3xl rounded-card border border-line bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-start gap-4">
              <Image src="/images/yeye-logo.png" alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-full bg-gold object-cover object-top" />
              <div>
                <p className="eyebrow">Written by</p>
                <p className="display mt-1 text-xl font-semibold">{site.author.name}</p>
                <p className="mt-1 text-ink-2">
                  Nigerian, Namibian and South African. Only child. Went from a Nigerian boarding school to a US economics degree and wrote it all down. Author of The Solo Scholar.
                </p>
                <Link href="/about" className="mt-3 inline-block font-medium text-ink">
                  Her story
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </article>

      {(prev || next) && (
        <nav aria-label="More on this shelf" className="container mt-16">
          <h2 className="eyebrow">More on the {shelf?.title.toLowerCase()} shelf</h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {prev && (
              <li>
                <ArticleCard post={prev} shelf={shelf} />
              </li>
            )}
            {next && (
              <li>
                <ArticleCard post={next} shelf={shelf} />
              </li>
            )}
          </ul>
        </nav>
      )}

      {guides.length > 0 && (
        <section aria-labelledby="article-guides" className="container mt-16">
          <h2 id="article-guides" className="eyebrow">
            Guides for this chapter
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4">
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

      <JsonLd
        data={graph(
          articleLd(post, shelf),
          breadcrumbLd([{ name: "Home", path: "/" }, { name: "Library", path: "/library" }, ...(shelf ? [{ name: shelf.title, path: `/library/${shelf.slug}` }] : []), { name: post.title, path: `/articles/${post.slug}` }])
        )}
      />
    </>
  );
}
