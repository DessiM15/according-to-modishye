import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { ExternalLink } from "@/components/ExternalLink";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, graph } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Yeyeside Talabi",
  description: "Questions about college applications, a guide, the book, or a topic you want covered. Email Yeye or use the form. Replies within a few days.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
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
              <dd className="mt-1 text-ink-2">Schools and student groups can ask about talks on the high school to college transition. Use the form and put &quot;Speaking&quot; in the subject.</dd>
            </div>
          </dl>
        </div>
        <div className="catalogue-card relative p-6 sm:p-8">
          <ContactForm />
        </div>
      </section>
      <JsonLd data={graph(breadcrumbLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]))} />
    </>
  );
}
