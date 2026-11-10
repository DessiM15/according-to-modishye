import { NextResponse } from "next/server";

// Contact form, delivered by Web3Forms to the address the access key was registered with (her support inbox).
// Without WEB3FORMS_ACCESS_KEY the message is accepted and logged, so the form still works in preview.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = { general: "A question or hello", speaking: "Speaking request", press: "Press or collaboration", other: "Something else" } as const;
type Topic = keyof typeof TOPICS;

type Body = Partial<Record<"name" | "email" | "topic" | "subject" | "message" | "organisation" | "audience" | "audienceSize" | "format" | "city" | "when" | "website", string>>;

const clean = (v: string | undefined, max: number) => (v ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true, mock: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const topic = (body.topic && body.topic in TOPICS ? body.topic : "general") as Topic;
  const message = clean(body.message, 5000);
  const speaking = topic === "speaking";

  const fields: Record<string, string> = {};
  let subject: string;
  if (speaking) {
    const organisation = clean(body.organisation, 200);
    if (!organisation) return NextResponse.json({ ok: false, error: "Add the school or organisation." }, { status: 422 });
    fields["School or organisation"] = organisation;
    fields["Audience"] = clean(body.audience, 80);
    fields["Audience size"] = clean(body.audienceSize, 80);
    fields["Format"] = clean(body.format, 40);
    fields["City"] = clean(body.city, 120);
    fields["Date or time frame"] = clean(body.when, 160);
    subject = `Speaking request: ${organisation}`;
  } else {
    subject = clean(body.subject, 200);
    if (!subject) return NextResponse.json({ ok: false, error: "Add a subject." }, { status: 422 });
  }
  if (!name || !EMAIL.test(email)) {
    return NextResponse.json({ ok: false, error: "Add your name and a valid email." }, { status: 422 });
  }
  if (speaking && !message) return NextResponse.json({ ok: false, error: "Tell her a little about the event." }, { status: 422 });

  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) {
    console.log("[contact mock]", { name, email, topic, subject, message, ...fields });
    return NextResponse.json({ ok: true, mock: true });
  }

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: key,
      subject: `[Website] ${subject}`,
      from_name: "Modishye website",
      name,
      email,
      "What is this about": TOPICS[topic],
      ...fields,
      message,
      botcheck: "",
    }),
  });
  const json = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
  if (!res.ok || !json.success) {
    console.error("[contact] web3forms failed", res.status, json.message);
    return NextResponse.json({ ok: false, error: "Could not send right now. Email support@accordingtomodishyeblog.com instead." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
