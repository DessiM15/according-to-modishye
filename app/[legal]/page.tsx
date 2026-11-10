import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getLegalPage, getLegalPages } from "@/lib/content";
import { formatDate } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLegalPages().map((p) => ({ legal: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ legal: string }> }): Promise<Metadata> {
  const page = getLegalPage((await params).legal);
  if (!page) return {};
  return { title: page.title, description: `${page.title} for Modishye and accordingtomodishyeblog.com.`, alternates: { canonical: `/${page.slug}` }, robots: { index: false, follow: true } };
}

export default async function LegalPage({ params }: { params: Promise<{ legal: string }> }) {
  const page = getLegalPage((await params).legal);
  if (!page) notFound();
  return (
    <div className="container pt-8">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: page.title }]} />
      <h1 className="mt-6 text-3xl font-semibold">{page.title}</h1>
      <p className="mt-2 font-mono text-sm text-ink-3">Last updated {formatDate(page.modified)}</p>
      {/* Carried over from the previous site, cleaned to plain semantic HTML. */}
      <div className="prose mt-10 !text-base" dangerouslySetInnerHTML={{ __html: page.html }} />
    </div>
  );
}
