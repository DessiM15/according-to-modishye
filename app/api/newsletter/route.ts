import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

// Mailchimp subscription. Needs three env vars at launch:
//   MAILCHIMP_API_KEY       e.g. abc123-us21
//   MAILCHIMP_SERVER_PREFIX e.g. us21 (the part after the dash in the key)
//   MAILCHIMP_AUDIENCE_ID   from Audience > Settings > Audience name and defaults
// Without them the endpoint answers as if it worked, so the mockup is usable end to end.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string; stage?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  // Honeypot: real people never fill this field.
  if (body.website) return NextResponse.json({ ok: true, mock: true });

  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL.test(email)) return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 422 });

  const stage = ["applying", "first-year", "graduate", "parent", "reader"].includes(body.stage ?? "") ? body.stage! : "reader";

  const key = process.env.MAILCHIMP_API_KEY;
  const server = process.env.MAILCHIMP_SERVER_PREFIX;
  const list = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!key || !server || !list) {
    return NextResponse.json({ ok: true, mock: true });
  }

  const hash = createHash("md5").update(email).digest("hex");
  const res = await fetch(`https://${server}.api.mailchimp.com/3.0/lists/${list}/members/${hash}`, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${Buffer.from(`anystring:${key}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: email,
      status_if_new: "pending", // double opt-in: Mailchimp emails a confirmation link
      tags: [stage, "website"],
    }),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    const msg = typeof detail?.detail === "string" && detail.detail.includes("already") ? "You are already on the list." : "Could not subscribe right now. Try again in a minute.";
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
