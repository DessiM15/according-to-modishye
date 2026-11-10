import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { draftClient, hasSanity } from "@/lib/sanity/client";

// "Preview on site" in the portal lands here with a short-lived secret, then shows the unpublished draft.
export async function GET(req: Request) {
  if (!hasSanity || !process.env.SANITY_API_READ_TOKEN) return new Response("Preview is not configured", { status: 503 });
  const { isValid, redirectTo = "/" } = await validatePreviewUrl(draftClient, req.url);
  if (!isValid) return new Response("This preview link is not valid or has expired", { status: 401 });
  (await draftMode()).enable();
  redirect(redirectTo);
}
