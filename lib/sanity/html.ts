import { toHTML, uriLooksSafe, type PortableTextHtmlComponents } from "@portabletext/to-html";
import type { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "./image";
import { youtubeId } from "@/lib/youtube";
import { site } from "@/lib/site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type ImageValue = { asset?: { _ref: string }; alt?: string; caption?: string; dimensions?: { width: number; height: number } };

const components: Partial<PortableTextHtmlComponents> = {
  types: {
    image: ({ value }: { value: ImageValue }) => {
      if (!value?.asset) return "";
      const src = urlFor(value).width(1400).url();
      const dims = value.dimensions;
      const size = dims ? ` width="${Math.round(dims.width)}" height="${Math.round(dims.height)}"` : "";
      const caption = value.caption ? `<figcaption>${esc(value.caption)}</figcaption>` : "";
      return `<figure><img src="${src}" alt="${esc(value.alt ?? "")}" loading="lazy"${size}>${caption}</figure>`;
    },
    youtube: ({ value }: { value: { url?: string } }) => {
      const id = youtubeId(value?.url);
      if (!id) return "";
      return `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "";
      if (!href || !uriLooksSafe(href)) return children;
      const external = /^https?:/i.test(href) && !href.startsWith(site.url);
      return `<a href="${esc(href)}"${external ? ' rel="noopener" target="_blank"' : ""}>${children}</a>`;
    },
  },
};

export function blocksToHtml(blocks: PortableTextBlock[] | null | undefined): string {
  if (!blocks?.length) return "";
  return toHTML(blocks, { components });
}

export function blocksToText(blocks: PortableTextBlock[] | null | undefined): string {
  if (!blocks?.length) return "";
  return blocks
    .filter((b) => b._type === "block" && Array.isArray(b.children))
    .map((b) => (b.children as { text?: string }[]).map((c) => c.text ?? "").join(""))
    .join("\n")
    .trim();
}

export function firstParagraph(blocks: PortableTextBlock[] | null | undefined): string {
  const p = blocks?.find((b) => b._type === "block" && (b as { style?: string }).style === "normal" && Array.isArray(b.children));
  if (!p) return "";
  return (p.children as { text?: string }[]).map((c) => c.text ?? "").join("").trim();
}
