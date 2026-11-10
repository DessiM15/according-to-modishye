import Link from "next/link";
import type { Post, Shelf } from "@/lib/content";
import { colours, hashColour } from "@/lib/site";
import { ArticleCard } from "@/components/ArticleCard";

function spineSize(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0;
  const widths = ["w-11", "w-12", "w-14", "w-16"];
  const heights = ["h-40", "h-44", "h-48", "h-52", "h-56"];
  return `${widths[h % widths.length]} ${heights[(h >> 3) % heights.length]}`;
}

// A full shelf: the row of spines is visual, the cards underneath are the accessible list.
export function Bookcase({ shelf, posts, showHeading = true }: { shelf: Shelf; posts: Post[]; showHeading?: boolean }) {
  const cardLevel = showHeading ? 3 : 2;
  const c = colours[shelf.colour];
  return (
    <section aria-labelledby={`shelf-${shelf.slug}`} className="scroll-mt-24" id={shelf.slug}>
      {showHeading && (
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">
              {shelf.chapter} · {posts.length} {posts.length === 1 ? "title" : "titles"}
            </p>
            <h2 id={`shelf-${shelf.slug}`} className="mt-1 text-2xl font-semibold">
              <Link href={`/library/${shelf.slug}`} className="text-ink no-underline hover:underline decoration-[3px] underline-offset-[6px]" style={{ textDecorationColor: c.hex }}>
                {shelf.title}
              </Link>
            </h2>
            <p className="mt-1 text-ink-2">{shelf.tagline}</p>
          </div>
          <Link href={`/library/${shelf.slug}`} className="btn btn-ghost">
            Whole shelf
          </Link>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-t-2xl bg-paper-2 px-4 pt-8 sm:px-8" aria-hidden="true">
        <div className="flex min-w-max items-end gap-1.5">
          {posts.map((p) => {
            const col = colours[hashColour(p.slug)];
            return (
              <span key={p.slug} className={`spine ${spineSize(p.slug)} text-sm`} style={{ background: col.hex, color: col.ink }}>
                {p.title}
              </span>
            );
          })}
          {posts.length < 4 &&
            Array.from({ length: 4 - posts.length }).map((_, i) => (
              <span key={i} className="spine h-44 w-10 text-xs" style={{ background: "#e8dec6", color: "#4b4740" }}>
                Coming soon
              </span>
            ))}
        </div>
        <div className="shelf-plank -mx-4 sm:-mx-8" />
      </div>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <ArticleCard post={p} shelf={shelf} headingLevel={cardLevel} />
          </li>
        ))}
      </ul>
    </section>
  );
}
