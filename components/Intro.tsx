// Library card intro. Pure CSS, 1.6 seconds total, once per session, never with reduced motion.
// It is aria-hidden and sits over the page without blocking assistive tech or scroll.
export function Intro() {
  return (
    <div className="intro fixed inset-0 z-[90] place-items-center bg-paper pointer-events-none" aria-hidden="true">
      <div className="intro-card catalogue-card relative w-[min(88vw,28rem)] p-6 pt-14">
        <p className="font-mono text-xs tracking-[0.18em] uppercase text-ink-3">Modishye Library · Date due</p>
        <div className="mt-2 space-y-[1.05rem] font-mono text-sm text-ink-2">
          <p>Boarding school</p>
          <p>Getting into college</p>
          <p>Surviving college</p>
          <p>Money</p>
          <p>Culture and voice</p>
        </div>
        <div className="intro-stamp absolute right-5 top-1/2 -translate-y-1/2 border-[3px] border-coral-deep text-coral-deep rounded-md px-3 py-2 font-mono text-lg tracking-[0.2em] uppercase">
          Welcome
        </div>
      </div>
    </div>
  );
}
