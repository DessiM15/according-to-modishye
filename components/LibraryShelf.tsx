"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { colours, type Colour } from "@/lib/site";

export type ShelfSummary = {
  slug: string;
  title: string;
  chapter: string;
  colour: Colour;
  tagline: string;
  description: string;
  posts: { slug: string; title: string; readingMinutes: number; video: boolean }[];
  guides: { slug: string; title: string; price: number }[];
};

// Her sketch: five books on a shelf, one per topic. Pull a book and the articles
// for that topic appear underneath. Built as tabs so it works with a keyboard and a screen reader.
export function LibraryShelf({ shelves, initial = "getting-into-college" }: { shelves: ShelfSummary[]; initial?: string }) {
  const [active, setActive] = useState(() => shelves.find((s) => s.slug === initial)?.slug ?? shelves[0].slug);
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = shelves.find((s) => s.slug === active)!;

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const last = shelves.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(shelves[next].slug);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div className="relative rounded-t-2xl bg-paper-2 px-3 pt-10 sm:px-6 sm:pt-14">
        <div role="tablist" aria-label="Library shelves" className="flex items-end justify-center gap-2 sm:gap-4">
          {shelves.map((shelf, i) => {
            const selected = shelf.slug === active;
            const c = colours[shelf.colour];
            const heights = ["h-56 sm:h-72", "h-64 sm:h-80", "h-60 sm:h-76", "h-52 sm:h-68", "h-62 sm:h-78"];
            return (
              <button
                key={shelf.slug}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`${id}-tab-${shelf.slug}`}
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(shelf.slug)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`spine ${heights[i % heights.length]} w-[18%] max-w-[88px] min-w-[52px] text-[clamp(0.8rem,0.6rem+0.9vw,1.15rem)] cursor-pointer`}
                style={{ background: c.hex, color: c.ink }}
              >
                <span className="font-mono text-[0.62em] font-normal tracking-[0.18em] mr-[0.35em]">{String(i + 1).padStart(2, "0")}</span>
                <span>{shelf.title}</span>
              </button>
            );
          })}
        </div>
        <div className="shelf-plank mt-0 -mx-3 sm:-mx-6" aria-hidden="true" />
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${current.slug}`}
        className="catalogue-card mt-6 p-5 sm:p-8"
      >
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">
              {current.chapter} · {current.posts.length} {current.posts.length === 1 ? "article" : "articles"}
            </p>
            <h3 className="mt-2 text-2xl font-semibold">{current.title}</h3>
            <p className="mt-3 text-ink-2">{current.description}</p>
            <Link href={`/library/${current.slug}`} className="btn btn-ghost mt-5">
              Browse this shelf
            </Link>
            {current.guides.length > 0 && (
              <div className="mt-6">
                <p className="eyebrow">Guides on this shelf</p>
                <ul className="mt-2 space-y-1.5">
                  {current.guides.map((g) => (
                    <li key={g.slug}>
                      <Link href={`/guides/${g.slug}`} className="font-medium text-ink hover:text-coral-deep">
                        {g.title}
                      </Link>
                      <span className="ml-2 font-mono text-xs text-ink-3">${g.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <p className="eyebrow">Pulled from the shelf</p>
            <ol className="mt-3 divide-y divide-line border-y border-line">
              {current.posts.map((p, i) => (
                <li key={p.slug}>
                  <Link href={`/articles/${p.slug}`} className="group flex items-baseline gap-4 py-3 no-underline">
                    <span className="font-mono text-xs text-ink-3 w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="display flex-1 text-lg leading-tight text-ink group-hover:text-coral-deep group-hover:underline">{p.title}</span>
                    <span className="hidden sm:inline font-mono text-xs text-ink-3 whitespace-nowrap">
                      {p.video ? "video · " : ""}
                      {p.readingMinutes} min
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
