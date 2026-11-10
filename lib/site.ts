export const site = {
  name: "Modishye",
  legalName: "According to Modishye",
  tagline: "The college library for the only child in the room",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.accordingtomodishyeblog.com",
  email: "support@accordingtomodishyeblog.com",
  author: {
    name: "Yeyeside Talabi",
    shortName: "Yeye",
    role: "Writer, YouTuber and author of The Solo Scholar",
  },
  founded: "2019",
  social: {
    youtube: "https://www.youtube.com/@modishye",
    x: "https://x.com/Modishye",
    snapchat: "https://www.snapchat.com/add/modishye",
  },
  book: {
    title: "The Solo Scholar",
    subtitle: "Conquering College as an Only Child",
    amazon: "https://a.co/d/6YddMaP",
    published: "2025-01",
    formats: ["Paperback", "Kindle"],
  },
  couponCode: "SAVEBIG15",
} as const;

export const nav = [
  { href: "/library", label: "Library" },
  { href: "/guides", label: "Guides" },
  { href: "/the-solo-scholar", label: "The Book" },
  { href: "/about", label: "Her Story" },
  { href: "/contact", label: "Contact" },
] as const;

export type Colour = "coral" | "gold" | "lavender" | "mint" | "magenta";

export const colours: Record<Colour, { hex: string; ink: string; name: string }> = {
  coral: { hex: "#ff3c38", ink: "#1a1917", name: "Coral" },
  gold: { hex: "#ffd23f", ink: "#1a1917", name: "Gold" },
  lavender: { hex: "#b7c0ee", ink: "#1a1917", name: "Lavender" },
  mint: { hex: "#acf7c1", ink: "#1a1917", name: "Mint" },
  magenta: { hex: "#f40076", ink: "#000000", name: "Magenta" },
};

export const colourOrder: Colour[] = ["coral", "gold", "lavender", "mint", "magenta"];

export function hashColour(seed: string): Colour {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return colourOrder[h % colourOrder.length];
}

export function formatDate(iso: string) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
