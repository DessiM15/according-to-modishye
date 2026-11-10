import Image from "next/image";

// 3D book with the cover art. Replace /images/solo-scholar-cover.png with the final cover file.
export function BookCover({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <div className={`book3d ${className}`} aria-hidden="true">
      <div className="book3d-inner" style={{ "--spine": "#a8004f" } as React.CSSProperties}>
        <div className="book3d-spine" />
        <div className="book3d-pages" />
        <div className="book3d-cover">
          <Image src="/images/solo-scholar-cover.png" alt="" fill sizes="(min-width: 768px) 24rem, 70vw" className="object-cover" priority={priority} />
        </div>
      </div>
    </div>
  );
}
