"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { colours, type Colour } from "@/lib/site";

export type RoadStop = { when: string; title?: string; body: ReactNode; colour: Colour; href?: string };

type Pt = { x: number; y: number };
type Seg = [Pt, Pt, Pt, Pt];

const WIDE: { w: number; h: number; segs: Seg[] } = {
  w: 1200,
  h: 300,
  segs: [
    [{ x: 20, y: 200 }, { x: 150, y: 50 }, { x: 260, y: 50 }, { x: 400, y: 180 }],
    [{ x: 400, y: 180 }, { x: 540, y: 310 }, { x: 660, y: 310 }, { x: 800, y: 160 }],
    [{ x: 800, y: 160 }, { x: 940, y: 10 }, { x: 1050, y: 10 }, { x: 1180, y: 150 }],
  ],
};
const TALL: { w: number; h: number; segs: Seg[] } = {
  w: 400,
  h: 1150,
  segs: [
    [{ x: 100, y: 10 }, { x: 30, y: 120 }, { x: 30, y: 220 }, { x: 100, y: 330 }],
    [{ x: 100, y: 330 }, { x: 170, y: 440 }, { x: 170, y: 540 }, { x: 100, y: 650 }],
    [{ x: 100, y: 650 }, { x: 30, y: 760 }, { x: 30, y: 860 }, { x: 100, y: 970 }],
    [{ x: 100, y: 970 }, { x: 150, y: 1040 }, { x: 160, y: 1090 }, { x: 100, y: 1140 }],
  ],
};
const FRACTIONS = [0.09, 0.3, 0.5, 0.7, 0.91];

function bez(s: Seg, t: number): Pt {
  const m = 1 - t;
  return {
    x: m * m * m * s[0].x + 3 * m * m * t * s[1].x + 3 * m * t * t * s[2].x + t * t * t * s[3].x,
    y: m * m * m * s[0].y + 3 * m * m * t * s[1].y + 3 * m * t * t * s[2].y + t * t * t * s[3].y,
  };
}

function sample(segs: Seg[]) {
  const pts: Pt[] = [];
  for (const s of segs) for (let i = 0; i <= 160; i++) pts.push(bez(s, i / 160));
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const total = cum[cum.length - 1];
  const at = (f: number) => {
    const target = Math.max(0, Math.min(1, f)) * total;
    let i = cum.findIndex((c) => c >= target);
    if (i < 0) i = pts.length - 1;
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    return { ...pts[i], angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI };
  };
  return { at, d: segs.map((s, i) => `${i === 0 ? `M ${s[0].x} ${s[0].y} ` : ""}C ${s[1].x} ${s[1].y}, ${s[2].x} ${s[2].y}, ${s[3].x} ${s[3].y}`).join(" ") };
}

const wide = sample(WIDE.segs);
const tall = sample(TALL.segs);

function Traveler() {
  // A backpack, the motif from her book cover.
  return (
    <svg width="46" height="52" viewBox="0 0 46 52" aria-hidden="true" className="drop-shadow-[0_6px_6px_rgba(26,25,23,0.35)]">
      <path d="M14 10 C14 3, 32 3, 32 10" fill="none" stroke="#1a1917" strokeWidth="3" strokeLinecap="round" />
      <rect x="6" y="9" width="34" height="38" rx="9" fill="#ff3c38" stroke="#1a1917" strokeWidth="2.5" />
      <rect x="12" y="27" width="22" height="14" rx="4" fill="#ffd23f" stroke="#1a1917" strokeWidth="2" />
      <rect x="9" y="12" width="28" height="9" rx="4" fill="#b7c0ee" stroke="#1a1917" strokeWidth="2" />
      <path d="M12 21 L12 47 M34 21 L34 47" stroke="#1a1917" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function Road({ geom, path, progress, stops, reached, layout }: { geom: { w: number; h: number }; path: ReturnType<typeof sample>; progress: MotionValue<number>; stops: RoadStop[]; reached: number; layout: "wide" | "tall" }) {
  const dash = useTransform(progress, (p) => 1 - p);
  const left = useTransform(progress, (p) => `${(path.at(p).x / geom.w) * 100}%`);
  const top = useTransform(progress, (p) => `${(path.at(p).y / geom.h) * 100}%`);
  const rotate = useTransform(progress, (p) => path.at(p).angle);
  const points = FRACTIONS.map((f) => path.at(f));
  const wide = layout === "wide";

  const svg = (
    <svg viewBox={`0 0 ${geom.w} ${geom.h}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true" preserveAspectRatio="none">
      {wide && points.map((pt, i) => <line key={i} x1={pt.x} y1={pt.y} x2={pt.x} y2={geom.h + 30} stroke="#1a1917" strokeWidth="2" strokeDasharray="6 6" opacity={i < reached ? 0.45 : 0.18} />)}
      <path d={path.d} fill="none" stroke="#1a1917" strokeWidth={wide ? 34 : 30} strokeLinecap="round" opacity="0.14" />
      <motion.path d={path.d} pathLength={1} fill="none" stroke="#1a1917" strokeWidth={wide ? 34 : 30} strokeLinecap="round" strokeDasharray="1" style={{ strokeDashoffset: dash }} />
      <motion.path d={path.d} pathLength={1} fill="none" stroke="#fbf7ee" strokeWidth="3" strokeDasharray="0.02 0.016" style={{ strokeDashoffset: dash }} />
      {points.map((pt, i) => (
        <g key={i} transform={`translate(${pt.x} ${pt.y})`}>
          <circle r={wide ? 20 : 17} fill={i < reached ? colours[stops[i].colour].hex : "#fbf7ee"} stroke="#1a1917" strokeWidth="4" style={{ transition: "fill 400ms ease" }} />
          <text textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-mono)" fontSize={wide ? 15 : 13} fontWeight="500" fill="#1a1917">
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );

  const traveler = (
    <motion.div className="absolute z-10" style={{ left, top, rotate, x: "-50%", y: "-60%" }} aria-hidden="true">
      <Traveler />
    </motion.div>
  );

  const card = (s: RoadStop, i: number) => (
    <>
      <p className="hand" style={{ color: i < reached ? (colours[s.colour].hex === "#f40076" ? "#a8004f" : "#b9201d") : "#4b4740" }}>
        {s.when}
      </p>
      {s.title && <p className="display mt-0.5 text-base font-semibold leading-tight">{s.title}</p>}
      <p className="mt-1 text-sm leading-snug text-ink-2">{s.body}</p>
      {s.href && (
        <a href={s.href} className="mt-1.5 inline-block font-mono text-xs text-ink">
          Read the shelf
        </a>
      )}
    </>
  );

  if (wide) {
    return (
      <div>
        <div className="relative" style={{ aspectRatio: `${geom.w} / ${geom.h}` }}>
          {svg}
          {traveler}
        </div>
        <ol className="relative mt-8 min-h-[12rem]">
          {stops.map((s, i) => (
            <li
              key={i}
              className={`road-stop text-center transition-transform duration-500 ${i < reached ? "translate-y-0" : "translate-y-2"}`}
              style={{ left: `clamp(5.5rem, ${(points[i].x / geom.w) * 100}%, calc(100% - 5.5rem))`, transform: "translateX(-50%)" }}
            >
              {card(s, i)}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className="relative" style={{ aspectRatio: `${geom.w} / ${geom.h}` }}>
      {svg}
      {traveler}
      <ol className="absolute inset-0">
        {stops.map((s, i) => (
          <li
            key={i}
            className={`absolute left-[46%] right-0 transition-transform duration-500 ${i < reached ? "translate-x-0" : "translate-x-1"}`}
            style={{ top: `${(points[i].y / geom.h) * 100}%`, transform: "translateY(-50%)" }}
          >
            {card(s, i)}
          </li>
        ))}
      </ol>
    </div>
  );
}

// A winding road that draws itself as you scroll. The backpack travels it and each milestone lights up as it passes.
export function RoadMap({ stops, endLabel = "Today" }: { stops: RoadStop[]; endLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.4 });
  const progress = useTransform(smooth, (p) => (reduce ? 1 : p));
  const [reachedRaw, setReached] = useState(0);
  useMotionValueEvent(progress, "change", (p) => {
    const n = FRACTIONS.filter((f) => p >= f - 0.02).length;
    setReached((r) => (r === n ? r : n));
  });
  const reached = reduce ? stops.length : reachedRaw;

  return (
    <div ref={ref} className="relative">
      <div className="hidden md:block">
        <div className="relative px-2 pb-6 pt-16">
          <Road geom={WIDE} path={wide} progress={progress} stops={stops} reached={reached} layout="wide" />
          <span className="absolute right-2 top-4 rotate-2 rounded-md border-2 border-ink bg-gold px-3 py-1 font-mono text-xs uppercase tracking-[0.16em] shadow-[3px_3px_0_#1a1917]">{endLabel}</span>
        </div>
      </div>
      <div className="md:hidden">
        <div className="relative px-1 pb-8 pt-4">
          <Road geom={TALL} path={tall} progress={progress} stops={stops} reached={reached} layout="tall" />
        </div>
      </div>
    </div>
  );
}
