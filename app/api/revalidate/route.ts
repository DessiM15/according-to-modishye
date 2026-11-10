import { revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { CONTENT_TAG } from "@/lib/sanity/load";

// Sanity calls this when she publishes. The affected pages are rebuilt on the next visit.
// Set the same secret in Sanity (Manage > API > Webhooks) and in SANITY_REVALIDATE_SECRET.
export async function POST(req: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const signature = req.headers.get(SIGNATURE_HEADER_NAME);
  const body = await req.text();
  if (!secret || !signature || !(await isValidSignature(body, signature, secret))) {
    return Response.json({ ok: false, message: "Invalid signature" }, { status: 401 });
  }
  revalidateTag(CONTENT_TAG, "max");
  return Response.json({ ok: true, revalidated: true, at: new Date().toISOString() });
}
