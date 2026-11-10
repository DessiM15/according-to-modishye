import type { ReactNode } from "react";

export function SectionHeader({ eyebrow, title, intro, action, id, as: Tag = "h2" }: { eyebrow?: string; title: string; intro?: ReactNode; action?: ReactNode; id?: string; as?: "h1" | "h2" }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && <p className="hand">{eyebrow}</p>}
      <Tag id={id} className={`mt-2 font-semibold ${Tag === "h1" ? "text-3xl" : "text-3xl"}`}>
        {title}
      </Tag>
      {intro && <p className="mx-auto mt-4 max-w-[58ch] text-lg text-ink-2">{intro}</p>}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
