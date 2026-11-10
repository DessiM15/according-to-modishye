import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { ExternalLink } from "@/components/ExternalLink";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, graph } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Yeyeside Talabi",
  description: "Questions about college applications, a guide, the book, or a topic you want covered. Schools can ask about booking Yeyeside to speak. Replies within a few days.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  return (
    <>
      <div className="container pt-8">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Contact" }]} />
      </div>
      <section className="container mt-8 grid gap-12 md:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="eyebrow">Let&apos;s talk</p>
          <h1 className="mt-2 text-3xl font-semibold">Contact</h1>
          <p className="mt-4 text-lg text-ink-2">
            A question about applying, a guide that did not download, a topic you want on a shelf, or just hello. Yeye reads everything and replies within a few days.
          </p>
          <dl className="mt-8 space-y-5">
            <div>
              <dt className="eyebrow">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${site.email}`} className="text-ink text-lg break-all">
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Elsewhere</dt>
              <dd className="mt-1 flex flex-wrap gap-x-5 gap-y-1">
                <ExternalLink href={site.social.youtube} className="text-ink">
                  YouTube
                </ExternalLink>
                <ExternalLink href={site.social.x} className="text-ink">
                  X
                </ExternalLink>
                <ExternalLink href={site.social.snapchat} className="text-ink">
                  Snapchat
                </ExternalLink>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Speaking</dt>
              <dd className="mt-1 text-ink-2">
                Yeyeside is available to speak at schools and to student and parent groups about getting into college, the first year away from home, and college as an only child. Choose &quot;Speaking request&quot; in the form and she will be in touch.
              </dd>
            </div>
          </dl>
        </div>
        <div className="catalogue-card relative p-6 sm:p-8">
          <ContactForm initialTopic={topic} />
        </div>
      </section>
      <JsonLd data={graph(breadcrumbLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]))} />
    </>
  );
}
