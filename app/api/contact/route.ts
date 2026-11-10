import { NextResponse } from "next/server";

// Contact form. At launch set RESEND_API_KEY and CONTACT_TO to deliver by email.
// Without them the message is accepted and logged, so the mockup form works.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { name?: string; email?: string; subject?: string; message?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true, mock: true });

  const name = (body.name ?? "").trim().slice(0, 120);
  const email = (body.email ?? "").trim().slice(0, 200);
  const subject = (body.subject ?? "").trim().slice(0, 200);
  const message = (body.message ?? "").trim().slice(0, 5000);

  if (!name || !EMAIL.test(email) || !subject) {
    return NextResponse.json({ ok: false, error: "Add your name, a valid email and a subject." }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!key || !to) {
    console.log("[contact mock]", { name, email, subject, message });
    return NextResponse.json({ ok: true, mock: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Modishye website <website@accordingtomodishyeblog.com>",
      to: [to],
      reply_to: email,
      subject: `[Website] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });
  if (!res.ok) return NextResponse.json({ ok: false, error: "Could not send right now. Email support@accordingtomodishyeblog.com instead." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
