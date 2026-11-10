"use client";

import { useId, useRef, useState } from "react";
import { colours, colourOrder } from "@/lib/site";

export type BookPage = { label: string; title: string; body: string };

// An open book. The bookmarks on the right are tabs, the spread is the panel, and the page corner turns to the next chapter.
export function OpenBook({ pages }: { pages: BookPage[] }) {
  const [index, setIndex] = useState(0);
  const [flipKey, setFlipKey] = useState(0);
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const page = pages[index];

  function go(n: number, focus = false) {
    const next = (n + pages.length) % pages.length;
    setIndex(next);
    setFlipKey((k) => k + 1);
    if (focus) tabRefs.current[next]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(i + 1, true); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(i - 1, true); }
    if (e.key === "Home") { e.preventDefault(); go(0, true); }
    if (e.key === "End") { e.preventDefault(); go(pages.length - 1, true); }
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_9rem] md:gap-0">
      <div className="openbook">
        <div className="grid md:grid-cols-2">
          <div className="openbook-page left p-6 sm:p-8">
            <p className="hand">{page.label}</p>
            <p className="display mt-3 text-2xl font-semibold leading-tight">{page.title}</p>
            <p className="mt-6 font-mono text-xs text-ink-3">
              Page {index * 2 + 1} of {pages.length * 2}
            </p>
          </div>
          <div key={flipKey} role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${index}`} className="openbook-page right openbook-flip flex flex-col p-6 sm:p-8">
            <p className="text-lg leading-relaxed text-ink">{page.body}</p>
            <div className="mt-auto flex items-center justify-between pt-6">
              <button type="button" className="font-mono text-xs text-ink-3 hover:text-ink" onClick={() => go(index - 1)}>
                Previous page
              </button>
              <button type="button" className="group inline-flex items-center gap-2 font-mono text-xs text-ink" onClick={() => go(index + 1)} aria-label={`Turn the page to ${pages[(index + 1) % pages.length].label}`}>
                Turn the page
                <span className="inline-block h-6 w-6 rounded-tl-xl border-l-2 border-t-2 border-ink bg-paper-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div role="tablist" aria-label="Chapters" aria-orientation="vertical" className="flex flex-row gap-2 md:mt-6 md:flex-col">
        {pages.map((p, i) => (
          <button
            key={i}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === index}
            aria-controls={`${id}-panel`}
            tabIndex={i === index ? 0 : -1}
            onClick={() => go(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className="bookmark"
            style={{ background: colours[colourOrder[i % colourOrder.length]].hex }}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
