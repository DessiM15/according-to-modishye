"use client";

import { useId, useState } from "react";

type Status = { kind: "idle" } | { kind: "busy" } | { kind: "done"; mock: boolean } | { kind: "error"; message: string };

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const id = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ kind: "busy" });
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong.");
      setStatus({ kind: "done", mock: Boolean(json.mock) });
      form.reset();
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full" noValidate>
      <div className={`grid gap-3 ${compact ? "" : "sm:grid-cols-[1fr_auto]"}`}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-email`} className="eyebrow block mb-1.5">
              Email address
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="w-full min-h-12 rounded-lg border-2 border-ink bg-white px-3 text-base text-ink placeholder:text-ink-3"
            />
          </div>
          <div>
            <label htmlFor={`${id}-stage`} className="eyebrow block mb-1.5">
              Where are you right now?
            </label>
            <select id={`${id}-stage`} name="stage" defaultValue="applying" className="w-full min-h-12 rounded-lg border-2 border-ink bg-white px-3 text-base text-ink">
              <option value="applying">Applying to college</option>
              <option value="first-year">In my first year</option>
              <option value="graduate">Grad school and working</option>
              <option value="parent">A parent</option>
              <option value="reader">Just here to read</option>
            </select>
          </div>
        </div>
        {/* Honeypot, hidden from people and skipped by assistive tech. */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Website</label>
          <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn btn-gold w-full justify-center sm:w-auto" disabled={status.kind === "busy"}>
            {status.kind === "busy" ? "Adding you…" : "Join the list"}
          </button>
        </div>
      </div>
      <p className="mt-2 text-sm text-ink-3">One email when something new lands on a shelf. Unsubscribe any time.</p>
      <p role="status" aria-live="polite" className="mt-2 min-h-6 text-sm font-medium">
        {status.kind === "done" && (status.mock ? "Thanks. Check your inbox to confirm. (Mailchimp connects at launch, so this is a preview.)" : "Thanks. Check your inbox to confirm your subscription.")}
        {status.kind === "error" && <span className="text-coral-deep">{status.message}</span>}
      </p>
    </form>
  );
}
