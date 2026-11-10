import Link from "next/link";
import type { Post, Shelf } from "@/lib/content";
import { colours } from "@/lib/site";
import { ArticleCard } from "@/components/ArticleCard";

// A shelf of face-out books. Each row of cards stands on a continuous wooden plank.
export function Bookcase({ shelf, posts, showHeading = true }: { shelf: Shelf; posts: Post[]; showHeading?: boolean }) {
  const cardLevel = showHeading ? 3 : 2;
  const c = colours[shelf.colour];
  return (
    <section aria-labelledby={`shelf-${shelf.slug}`} className="scroll-mt-24" id={shelf.slug}>
      {showHeading && (
        <div className="mx-auto max-w-2xl text-center">
          <p className="hand">
            {shelf.chapter} · {posts.length} {posts.length === 1 ? "title" : "titles"}
          </p>
          <h2 id={`shelf-${shelf.slug}`} className="mt-1 text-3xl font-semibold">
            <Link href={`/library/${shelf.slug}`} className="text-ink no-underline hover:underline decoration-[4px] underline-offset-[8px]" style={{ textDecorationColor: c.hex }}>
              {shelf.title}
            </Link>
          </h2>
          <p className="mt-2 text-lg text-ink-2">{shelf.tagline}</p>
          <Link href={`/library/${shelf.slug}`} className="btn btn-ghost mt-5">
            Whole shelf
          </Link>
        </div>
      )}

      <ul className="mt-10 grid gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug} className="relative px-4 pb-5 sm:px-5">
            <ArticleCard post={p} shelf={shelf} headingLevel={cardLevel} book />
            <span className="plank absolute inset-x-0 bottom-0" aria-hidden="true" />
          </li>
        ))}
        {posts.length < 3 &&
          Array.from({ length: 3 - posts.length }).map((_, i) => (
            <li key={`empty-${i}`} className="relative hidden px-5 pb-5 lg:block">
              <div className="flex h-full min-h-[14rem] items-end justify-center rounded-card border-2 border-dashed border-line pb-8 text-center">
                <p className="hand !text-ink-3">room for the next one</p>
              </div>
              <span className="plank absolute inset-x-0 bottom-0" aria-hidden="true" />
            </li>
          ))}
      </ul>
    </section>
  );
}
