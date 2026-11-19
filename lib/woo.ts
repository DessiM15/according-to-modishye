// WooCommerce is where she adds products, sets prices and takes payment, so the shop is the source of truth
// for what is on sale. This reads the store's public product feed (no key needed) and lays it over the guides
// from the portal:
//   - a guide linked to a product (wooId) shows the price charged at checkout, and leaves the site when the
//     product is unpublished or deleted in WooCommerce;
//   - a product with no guide in the portal still gets a card and a page, built from what she typed in WooCommerce.
// If the store cannot be reached the site carries on with the portal content alone.
import type { Guide, Shelf } from "@/lib/content";
import { hashColour } from "@/lib/site";

// How long a page may show the previous product list before checking the store again.
const REFRESH_SECONDS = 300;

type WooProduct = {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  is_purchasable?: boolean;
  prices?: { price?: string; currency_code?: string; currency_minor_unit?: number };
  images?: { src?: string; alt?: string }[];
  categories?: { name: string; slug: string }[];
  tags?: { name: string; slug: string }[];
};

const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decode(text: string) {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] !== "#") return entities[code.toLowerCase()] ?? match;
    const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
    return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : match;
  });
}

const plain = (html = "") => decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

function shorten(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 3).replace(/\s+\S*$/, "") + "..." : text;
}

// Her older products are typed in capitals. On the site titles read as normal headings.
function tidyTitle(name: string) {
  const title = decode(name).trim();
  if (title !== title.toUpperCase() || title === title.toLowerCase()) return title;
  return title.toLowerCase().replace(/(^|[\s\-(])([a-z])/g, (_, lead: string, letter: string) => lead + letter.toUpperCase());
}

const key = (text: string) => decode(text).toLowerCase().replace(/[^a-z0-9]+/g, "");

function price(p: WooProduct): number | null {
  const raw = Number(p.prices?.price);
  if (!p.prices?.price || !Number.isFinite(raw)) return null;
  return raw / 10 ** (p.prices.currency_minor_unit ?? 2);
}

async function fetchProducts(): Promise<WooProduct[] | null> {
  const store = process.env.NEXT_PUBLIC_WOO_URL?.replace(/\/+$/, "");
  if (!store) return null;
  try {
    const res = await fetch(`${store}/wp-json/wc/store/v1/products?per_page=100`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: REFRESH_SECONDS },
    });
    if (!res.ok) return null;
    const products: unknown = await res.json();
    // An empty answer is treated as "store unreachable" so a hiccup can never empty the shop.
    return Array.isArray(products) && products.length > 0 ? (products as WooProduct[]) : null;
  } catch {
    return null;
  }
}

// A product lands on a shelf when one of its WooCommerce categories or tags is named after that shelf.
function shelfFor(p: WooProduct, shelves: Shelf[]) {
  const labels = [...(p.categories ?? []), ...(p.tags ?? [])].flatMap((t) => [key(t.name), key(t.slug)]);
  return shelves.find((s) => labels.includes(key(s.slug)) || labels.includes(key(s.title)));
}

function fromProduct(p: WooProduct, amount: number, shelves: Shelf[], taken: Set<string>): Guide {
  const shelf = shelfFor(p, shelves);
  const title = tidyTitle(p.name);
  const text = plain(p.description);
  const image = p.images?.[0];
  return {
    slug: taken.has(p.slug) ? `${p.slug}-${p.id}` : p.slug,
    legacySlug: p.slug,
    wooId: p.id,
    title,
    subtitle: shorten(plain(p.short_description), 110),
    shelf: shelf?.slug ?? "",
    colour: shelf?.colour ?? hashColour(p.slug),
    pages: "PDF download",
    audience: "",
    price: amount,
    currency: p.prices?.currency_code ?? "USD",
    image: image?.src ?? null,
    imageAlt: image?.alt ? decode(image.alt) : `${title} cover`,
    description: shorten(text || plain(p.short_description) || title, 155),
    html: p.description ?? "",
  };
}

export async function withShopProducts(guides: Guide[], shelves: Shelf[]): Promise<Guide[]> {
  const products = await fetchProducts();
  if (!products) return guides;

  const onSale = new Map<number, { product: WooProduct; amount: number }>();
  for (const product of products) {
    const amount = price(product);
    if (product.is_purchasable !== false && amount !== null) onSale.set(product.id, { product, amount });
  }

  const linked = new Set<number>();
  const fromPortal = guides.flatMap((g) => {
    if (!g.wooId) return [g];
    const match = onSale.get(g.wooId);
    if (!match) return [];
    linked.add(g.wooId);
    return [{ ...g, price: match.amount, currency: match.product.prices?.currency_code ?? g.currency }];
  });

  const taken = new Set(fromPortal.map((g) => g.slug));
  const fromShop = [...onSale.values()]
    .filter(({ product }) => !linked.has(product.id))
    .sort((a, b) => b.product.id - a.product.id)
    .map(({ product, amount }) => fromProduct(product, amount, shelves, taken));

  return [...fromPortal, ...fromShop];
}
