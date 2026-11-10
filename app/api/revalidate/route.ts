import { revalidatePath, revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { CONTENT_TAG } from "@/lib/sanity/load";

// Sanity calls this when she publishes, updates or deletes something.
// Set the same secret in Sanity (Manage > API > Webhooks) and in SANITY_REVALIDATE_SECRET.
type Payload = { _id?: string; _type?: string; slug?: string | null };

function pathFor(p: Payload): string | null {
  if (!p.slug) return null;
  if (p._type === "article") return `/articles/${p.slug}`;
  if (p._type === "guide") return `/guides/${p.slug}`;
  if (p._type === "legalPage") return `/${p.slug}`;
  return null;
}

export async function POST(req: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  const body = await req.text();
  if (!secret || !signature || !(await isValidSignature(body, signature, secret))) {
    return Response.json({ ok: false, message: "Invalid signature" }, { status: 401 });
  }
  let payload: Payload = {};
  try {
    payload = JSON.parse(body);
  } catch {}

  // Data: every page reads one tagged query, so one tag covers the lot. expire: 0 means immediate expiry,
  // not stale-while-revalidate, so the next render fetches fresh content instead of baking the old data in.
  revalidateTag(CONTENT_TAG, { expire: 0 });
  // Pages: expire everything so listings, the sitemap and the changed page all rebuild on the next visit.
  // The site is a few dozen pages, so this is cheap, and it also removes a deleted article's page.
  revalidatePath("/", "layout");
  const path = pathFor(payload);
  if (path) revalidatePath(path);

  return Response.json({ ok: true, revalidated: true, path, at: new Date().toISOString() });
}
