import Link from "next/link";
import { getShelves } from "@/lib/content";
import { colours } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="container py-20">
      <div className="catalogue-card mx-auto max-w-xl p-8">
        <p className="eyebrow">Card not found</p>
        <h1 className="mt-2 text-3xl font-semibold">That page is not on any shelf.</h1>
        <p className="mt-4 text-ink-2">The link may be old. Try one of the shelves or go back to the front desk.</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {getShelves().map((s) => (
            <li key={s.slug}>
              <Link href={`/library/${s.slug}`} className="sticker !text-base !py-2" style={{ background: colours[s.colour].hex, color: colours[s.colour].ink }}>
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/" className="btn mt-8">
          Front desk
        </Link>
      </div>
    </div>
  );
}
