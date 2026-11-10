import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility statement",
  description: "How this site is built to be used with a keyboard, a screen reader, low vision or a small phone, and how to report a problem.",
  alternates: { canonical: "/accessibility" },
};

const done = [
  "Every page has one main heading, a main landmark, and a skip link to the content.",
  "Text meets WCAG AA contrast on every background, including the brand colours.",
  "Keyboard focus is always visible. The library shelf works with arrow keys.",
  "Links say where they go. Links that open a new tab say so.",
  "Videos load as a titled player, only when you press play.",
  "Pinch to zoom is never blocked. Text scales with your browser settings.",
  "Animation is removed when your device asks for reduced motion.",
  "Forms have visible labels, error messages that are announced, and no time limits.",
];

export default function AccessibilityPage() {
  return (
    <div className="container pt-8">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Accessibility" }]} />
      <div className="max-w-3xl">
        <h1 className="mt-6 text-3xl font-semibold">Accessibility</h1>
        <p className="mt-4 text-lg text-ink-2">
          This site is built to WCAG 2.2 level AA. If something does not work for you, email{" "}
          <a href={`mailto:${site.email}`} className="text-ink">
            {site.email}
          </a>{" "}
          with the page and what happened, and it gets fixed.
        </p>
        <h2 className="mt-10 text-xl font-semibold">What that means in practice</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-2">
          {done.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
        <h2 className="mt-10 text-xl font-semibold">Known limits</h2>
        <p className="mt-3 text-ink-2">
          One older article was originally published as an image of text. It is marked on the page and the text version is being added. Older YouTube videos may not have captions on every line.
        </p>
      </div>
    </div>
  );
}
