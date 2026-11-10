"use client";

import Link from "next/link";
import { useId, useState } from "react";

type Status = { kind: "idle" } | { kind: "busy" } | { kind: "done"; mock: boolean } | { kind: "error"; message: string };

const field = "w-full min-h-12 rounded-lg border-2 border-ink bg-white px-3 py-2 text-base text-ink placeholder:text-ink-3";

export function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setStatus({ kind: "busy" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong.");
      setStatus({ kind: "done", mock: Boolean(json.mock) });
      form.reset();
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="eyebrow block mb-1.5">Your name</label>
          <input id={`${id}-name`} name="name" type="text" autoComplete="name" required className={field} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="eyebrow block mb-1.5">Your email</label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" required className={field} />
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-subject`} className="eyebrow block mb-1.5">Subject</label>
        <input id={`${id}-subject`} name="subject" type="text" required className={field} />
      </div>
      <div>
        <label htmlFor={`${id}-message`} className="eyebrow block mb-1.5">Message</label>
        <textarea id={`${id}-message`} name="message" rows={6} className={field} />
      </div>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex items-start gap-3">
        <input id={`${id}-consent`} name="consent" type="checkbox" required className="mt-1.5 h-5 w-5 accent-ink" />
        <label htmlFor={`${id}-consent`} className="text-sm text-ink-2">
          I have read the <Link href="/privacy-policy" className="text-ink underline">privacy policy</Link> and agree to my details being used to reply to this message.
        </label>
      </div>
      <div>
        <button type="submit" className="btn" disabled={status.kind === "busy"}>
          {status.kind === "busy" ? "Sending…" : "Send message"}
        </button>
      </div>
      <p role="status" aria-live="polite" className="min-h-6 text-sm font-medium">
        {status.kind === "done" && (status.mock ? "Sent. Yeye replies within a few days. (Email delivery connects at launch, so this is a preview.)" : "Sent. Yeye replies within a few days.")}
        {status.kind === "error" && <span className="text-coral-deep">{status.message}</span>}
      </p>
    </form>
  );
}
