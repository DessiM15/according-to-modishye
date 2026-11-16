"use client";

import Link from "next/link";
import { useId, useState } from "react";

type Status = { kind: "idle" } | { kind: "busy" } | { kind: "done"; mock: boolean; speaking: boolean } | { kind: "error"; message: string };

const field = "w-full min-h-12 rounded-lg border-2 border-ink bg-white px-3 py-2 text-base text-ink placeholder:text-ink-3";

// Web3Forms only accepts submissions sent from the visitor's browser, so the form posts to it directly.
// The access key is public by design: it only routes messages to the inbox it was registered with.
// Without the key the form answers as if it worked, so a local preview stays usable.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
const SEND_ERROR = "Could not send right now. Email support@accordingtomodishyeblog.com instead.";

const clean = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v : "").trim().slice(0, max);

const topics = [
  { value: "general", label: "A question or hello" },
  { value: "speaking", label: "Speaking request" },
  { value: "press", label: "Press or collaboration" },
  { value: "other", label: "Something else" },
];

export function ContactForm({ initialTopic = "general" }: { initialTopic?: string }) {
  const id = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [topic, setTopic] = useState(topics.some((t) => t.value === initialTopic) ? initialTopic : "general");
  const speaking = topic === "speaking";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setStatus({ kind: "busy" });
    try {
      const data = new FormData(form);
      const done = (mock: boolean) => {
        setStatus({ kind: "done", mock, speaking });
        form.reset();
        setTopic("general");
      };
      // Honeypot: real people never fill this field.
      if (clean(data.get("website"), 200)) return done(true);

      const details: Record<string, string> = {};
      let subject: string;
      if (speaking) {
        const organization = clean(data.get("organization"), 200);
        subject = `Speaking request: ${organization}`;
        const event: Record<string, string> = {
          "School or organization": organization,
          Audience: clean(data.get("audience"), 80),
          "Audience size": clean(data.get("audienceSize"), 80),
          Format: clean(data.get("format"), 40),
          City: clean(data.get("city"), 120),
          "Date or time frame": clean(data.get("when"), 160),
        };
        for (const [label, value] of Object.entries(event)) if (value) details[label] = value;
      } else {
        subject = clean(data.get("subject"), 200);
      }
      if (!WEB3FORMS_KEY) return done(true);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[Website] ${subject}`,
          from_name: "Modishye website",
          name: clean(data.get("name"), 120),
          email: clean(data.get("email"), 200),
          "What is this about": topics.find((t) => t.value === topic)?.label ?? topic,
          ...details,
          message: clean(data.get("message"), 5000),
          botcheck: "",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (!res.ok || !json.success) throw new Error(SEND_ERROR);
      setStatus({ kind: "done", mock: false, speaking });
      form.reset();
      setTopic("general");
    } catch {
      setStatus({ kind: "error", message: SEND_ERROR });
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div>
        <label htmlFor={`${id}-topic`} className="eyebrow block mb-1.5">What is this about?</label>
        <select id={`${id}-topic`} name="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={field}>
          {topics.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

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

      {speaking ? (
        <fieldset className="grid gap-5 rounded-lg border-2 border-dashed border-ink/40 p-4 sm:p-5">
          <legend className="hand px-2 !text-[1.3rem]">About the event</legend>
          <div>
            <label htmlFor={`${id}-organization`} className="eyebrow block mb-1.5">School or organization</label>
            <input id={`${id}-organization`} name="organization" type="text" autoComplete="organization" required className={field} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-audience`} className="eyebrow block mb-1.5">Who is the audience?</label>
              <select id={`${id}-audience`} name="audience" required className={field} defaultValue="">
                <option value="" disabled>
                  Choose one
                </option>
                <option>High school students</option>
                <option>College students</option>
                <option>Parents</option>
                <option>Mixed or other</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-size`} className="eyebrow block mb-1.5">Roughly how many people?</label>
              <input id={`${id}-size`} name="audienceSize" type="text" inputMode="numeric" placeholder="e.g. 40" className={field} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-format`} className="eyebrow block mb-1.5">In person or virtual?</label>
              <select id={`${id}-format`} name="format" required className={field} defaultValue="">
                <option value="" disabled>
                  Choose one
                </option>
                <option>In person</option>
                <option>Virtual</option>
                <option>Either</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-city`} className="eyebrow block mb-1.5">City</label>
              <input id={`${id}-city`} name="city" type="text" autoComplete="address-level2" className={field} />
            </div>
          </div>
          <div>
            <label htmlFor={`${id}-when`} className="eyebrow block mb-1.5">Date or time frame</label>
            <input id={`${id}-when`} name="when" type="text" placeholder="e.g. March 2027, or flexible" className={field} />
          </div>
        </fieldset>
      ) : (
        <div>
          <label htmlFor={`${id}-subject`} className="eyebrow block mb-1.5">Subject</label>
          <input id={`${id}-subject`} name="subject" type="text" required className={field} />
        </div>
      )}

      <div>
        <label htmlFor={`${id}-message`} className="eyebrow block mb-1.5">{speaking ? "Tell her about the occasion" : "Message"}</label>
        <textarea id={`${id}-message`} name="message" rows={6} required={speaking} className={field} placeholder={speaking ? "What the event is, what you would like her to talk about, and anything else that helps." : undefined} />
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
          {status.kind === "busy" ? "Sending…" : speaking ? "Send speaking request" : "Send message"}
        </button>
      </div>
      <p role="status" aria-live="polite" className="min-h-6 text-sm font-medium">
        {status.kind === "done" && (status.mock ? "Sent. Yeye replies within a few days. (Email delivery connects at launch, so this is a preview.)" : status.speaking ? "Sent. Yeye will be in touch about the event within a few days." : "Sent. Yeye replies within a few days.")}
        {status.kind === "error" && <span className="text-coral-deep">{status.message}</span>}
      </p>
    </form>
  );
}
