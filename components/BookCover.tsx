// A typographic cover for The Solo Scholar, built in CSS so it stays crisp at any size.
// Swap for the real cover art when she sends it.
export function BookCover({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-[2/3] w-full ${className}`} aria-hidden="true">
      <div className="absolute inset-0 translate-x-3 translate-y-2 rounded-r-lg bg-ink/25 blur-md" />
      <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-l-sm rounded-r-lg bg-magenta p-[9%] text-black shadow-[inset_8px_0_0_rgba(255,255,255,.35),inset_-2px_0_0_rgba(26,25,23,.25)]">
        <p className="font-mono text-[0.6em] tracking-[0.2em] uppercase">Modishye</p>
        <div>
          <p className="display text-[2.1em] font-bold leading-[0.9]" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1' }}>
            The
            <br />
            Solo
            <br />
            Scholar
          </p>
          <p className="mt-[0.9em] max-w-[12em] font-mono text-[0.6em] leading-snug">Conquering college as an only child</p>
        </div>
        <p className="font-mono text-[0.6em] tracking-[0.12em] uppercase">Yeyeside Talabi</p>
        <span className="absolute -right-8 top-[38%] rotate-90 font-mono text-[0.55em] tracking-[0.25em] uppercase">Paperback · Kindle</span>
      </div>
    </div>
  );
}
