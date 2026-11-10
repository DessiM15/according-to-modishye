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

const heights = ["92%", "100%", "95%", "88%", "97%"];

// Her sketch: five books on a wooden shelf, one per topic. Pull a book and its articles appear underneath.
// Built as tabs so it works with a keyboard and a screen reader.
export function Shelf({ shelves, initial = "getting-into-college" }: { shelves: ShelfSummary[]; initial?: string }) {
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
      <div className="bookcase">
        <div className="bookcase-back overflow-x-auto px-4 pt-12 sm:px-8">
          <div role="tablist" aria-label="Library shelves" className="mx-auto flex h-[17rem] w-max min-w-full items-end justify-center gap-2 sm:gap-3 md:h-[20rem]">
            {shelves.map((shelf, i) => {
              const selected = shelf.slug === active;
              const c = colours[shelf.colour];
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
                  className="tome w-[7.6rem] sm:w-[8.6rem] md:w-[10.5rem]"
                  style={{ background: c.hex, color: c.ink, height: heights[i] }}
                >
                  <span className="tome-spine-text">Modishye · Shelf {String(i + 1).padStart(2, "0")}</span>
                  <span className="tome-label">
                    <span className="hand block !text-[1rem] leading-none sm:!text-[1.3rem]">{shelf.chapter}</span>
                    <span className="display mt-1 block text-[0.95rem] font-semibold leading-[1.1] sm:text-[1.15rem]">{shelf.title}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="plank -mx-[14px]" aria-hidden="true" />
      </div>

      <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${current.slug}`} className="catalogue-card mt-8 p-5 sm:p-8">
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="hand">
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
                    <span className="hand w-7 shrink-0 text-[1.2rem]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="display flex-1 text-lg leading-tight text-ink group-hover:text-coral-deep group-hover:underline">{p.title}</span>
                    <span className="hidden whitespace-nowrap font-mono text-xs text-ink-3 sm:inline">
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
