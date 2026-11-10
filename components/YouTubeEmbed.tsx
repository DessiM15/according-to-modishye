"use client";

import { useState } from "react";
import Image from "next/image";

// Lite embed: a thumbnail button first, the iframe only when asked. The iframe is titled.
export function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-ink shadow-card">
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={`YouTube video: ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlay(true)}
          className="group absolute inset-0 flex h-full w-full items-center justify-center on-dark"
          aria-label={`Play video: ${title}`}
        >
          <Image src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" fill sizes="(min-width: 768px) 60vw, 100vw" className="object-cover opacity-90 transition-opacity group-hover:opacity-100" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-coral text-ink shadow-lift transition-transform group-hover:scale-110">
            <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
