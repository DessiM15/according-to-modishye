import Link from "next/link";
import Image from "next/image";
import type { Guide } from "@/lib/content";
import { colours } from "@/lib/site";

export function GuideCard({ guide }: { guide: Guide }) {
  const c = colours[guide.colour];
  return (
    <article className="group flex h-full flex-col">
      <Link href={`/guides/${guide.slug}`} className="no-underline" aria-hidden="true" tabIndex={-1}>
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-r-lg rounded-l-sm border border-ink/10 shadow-[inset_6px_0_0_rgba(255,255,255,.4),8px_10px_24px_-14px_rgba(26,25,23,.7)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[-1.5deg]"
          style={{ background: c.hex }}
        >
          {guide.image && <Image src={guide.image} alt="" fill sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 60vw" className="object-cover" />}
        </div>
      </Link>
      <div className="mt-4 flex flex-1 flex-col">
        <h3 className="text-lg font-semibold leading-tight">
          <Link href={`/guides/${guide.slug}`} className="text-ink no-underline group-hover:underline decoration-2 underline-offset-4">
            {guide.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-ink-2">{guide.subtitle}</p>
        <p className="mt-auto pt-3 font-mono text-sm">
          <span className="rounded-md bg-ink px-2 py-1 text-paper">${guide.price}</span>
          <span className="ml-2 text-xs text-ink-3">{guide.pages}</span>
        </p>
      </div>
    </article>
  );
}
