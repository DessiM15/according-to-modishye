import Link from "next/link";
import Image from "next/image";
import { colours } from "@/lib/site";
import type { Shelf } from "@/lib/content";

const tilts = [-3, 2, -2, 3, -1];

export function Hero({ shelves }: { shelves: Shelf[] }) {
  const words = "The college library for the only child in the room.".split(" ");
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div className="container relative py-10 sm:py-16 md:py-24">
        <div className="grid items-center gap-10 md:grid-cols-[1.3fr_0.7fr] lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative z-10">
            <p className="eyebrow rise" style={{ "--delay": "0ms" } as React.CSSProperties}>
              Modishye Library · Est. 2019 · By Yeyeside Talabi
            </p>
            <h1 id="hero-title" className="mt-4 text-hero font-semibold">
              {words.map((w, i) => (
                <span key={i} className="inline-block rise" style={{ "--delay": `${80 + i * 55}ms` } as React.CSSProperties}>
                  {w}
                  {i < words.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>
            <p className="rise mt-6 max-w-[52ch] text-lg text-ink-2" style={{ "--delay": "700ms" } as React.CSSProperties}>
              Yeyeside Talabi was born in the United States, went to boarding school in Nigeria, and came back to graduate high school in Texas at sixteen. Then came community college and a private college, where she studied Economics. Every lesson from that road is on these shelves, sorted by the moment you are in.
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={{ "--delay": "820ms" } as React.CSSProperties}>
              <Link href="/library" className="btn">
                Open the library
              </Link>
              <Link href="/the-solo-scholar" className="btn btn-ghost">
                Read the book
              </Link>
            </div>
            <nav aria-label="Jump to a shelf" className="rise mt-12" style={{ "--delay": "900ms" } as React.CSSProperties}>
              <ul className="flex flex-wrap gap-x-3 gap-y-4">
                {shelves.map((shelf, i) => (
                  <li key={shelf.slug} style={{ marginTop: i % 2 ? 10 : 0 }}>
                    <Link
                      href={`/library/${shelf.slug}`}
                      className="sticker float"
                      style={{ background: colours[shelf.colour].hex, color: colours[shelf.colour].ink, "--tilt": `${tilts[i]}deg`, "--dur": `${5 + i * 0.7}s`, "--delay": `${i * 0.4}s` } as React.CSSProperties}
                    >
                      <span className="font-mono text-[0.7em] font-normal tracking-[0.16em] uppercase">{String(i + 1).padStart(2, "0")}</span>
                      {shelf.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="relative mx-auto w-full max-w-[18rem] sm:max-w-xs md:max-w-sm">
            <div className="rise relative" style={{ "--delay": "300ms" } as React.CSSProperties}>
              <div className="absolute left-[10.5%] right-[13.5%] top-[4.5%] bottom-[8.5%] -z-10 rounded-full bg-gold" aria-hidden="true" />
              <Image
                src="/images/modishye-portrait.png"
                alt="Illustration of Yeyeside: a woman with a full natural afro, gold hoop earrings and a lavender dress, resting her chin on her hand beside a stack of books, inside an oval frame of flowers and leaves"
                width={1122}
                height={1402}
                sizes="(min-width: 768px) 24rem, 70vw"
                className="h-auto w-full"
                priority
              />
            </div>
            <Link
              href="/the-solo-scholar"
              className="sticker float absolute -left-2 -bottom-5 bg-coral md:-left-8 md:-bottom-4"
              style={{ "--tilt": "-6deg", "--dur": "6s" } as React.CSSProperties}
            >
              The Solo Scholar, out now
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
