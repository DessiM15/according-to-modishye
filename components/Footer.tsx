import Link from "next/link";
import { site } from "@/lib/site";
import { getGuides, getShelves } from "@/lib/content";
import { ExternalLink } from "@/components/ExternalLink";

export async function Footer() {
  const shelves = getShelves();
  const guides = await getGuides();
  return (
    <footer className="on-dark mt-24 bg-ink text-paper">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="display text-2xl font-semibold">Modishye</p>
          <p className="mt-3 max-w-sm text-paper/80">
            Articles, guides and a book for students getting into college and through it, written by someone who did it the hard way.
          </p>
          <p className="mt-6 font-mono text-xs tracking-[0.16em] uppercase text-paper/60">Est. {site.founded} · Online only</p>
        </div>

        <nav aria-label="Library shelves">
          <p className="eyebrow !text-paper/60">Library</p>
          <ul className="mt-3 space-y-2">
            {shelves.map((s) => (
              <li key={s.slug}>
                <Link href={`/library/${s.slug}`} className="text-paper hover:text-gold">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Guides and book">
          <p className="eyebrow !text-paper/60">Shop</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/the-solo-scholar" className="text-paper hover:text-gold">
                The Solo Scholar (book)
              </Link>
            </li>
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="text-paper hover:text-gold">
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Connect">
          <p className="eyebrow !text-paper/60">Connect</p>
          <ul className="mt-3 space-y-2">
            <li>
              <ExternalLink href={site.social.youtube} className="text-paper hover:text-gold">
                YouTube
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={site.social.x} className="text-paper hover:text-gold">
                X (Twitter)
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={site.social.snapchat} className="text-paper hover:text-gold">
                Snapchat
              </ExternalLink>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="text-paper hover:text-gold">
                Email Yeye
              </a>
            </li>
            <li>
              <Link href="/contact" className="text-paper hover:text-gold">
                Contact form
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-paper/15">
        <div className="container flex flex-col gap-3 py-6 text-sm text-paper/70 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</p>
            <p>
              This website was developed by{" "}
              <ExternalLink href="https://smartscaleagent.com/contact" className="text-paper underline underline-offset-2 hover:text-gold">
                Smart Scale LLC
              </ExternalLink>
              .
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link href="/privacy-policy" className="hover:text-gold">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-gold">Terms</Link></li>
            <li><Link href="/refunds" className="hover:text-gold">Refunds</Link></li>
            <li><Link href="/cookies" className="hover:text-gold">Cookies</Link></li>
            <li><Link href="/accessibility" className="hover:text-gold">Accessibility</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
