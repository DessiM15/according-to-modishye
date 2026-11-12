// Story hour: the author reads a page of her book, the way a librarian reads to the room.
// Self-hosted because the clip is under a minute. Nothing downloads until the visitor presses play.
// Captions are on by default and the full text sits underneath for anyone who would rather read.
export const reading = {
  src: "/video/solo-scholar-reading.mp4",
  poster: "/video/solo-scholar-reading.jpg",
  captions: "/video/solo-scholar-reading.en.vtt",
  seconds: 44,
  uploaded: "2026-11-12",
  source: "Sophomore year, page 38",
  transcript: [
    "Sophomore year: career preparation, networking and goal setting, and this is on page 38.",
    "It is crucial to have a clear plan for your academic and personal goals. However, it is equally important to remain flexible and open to changes. Life often requires adjustments to your initial plans, and being adaptable can lead to new opportunities and experiences that you might not have considered.",
    "Think of your plan as a road map: having a clear destination in mind but willing to take detours when necessary. This flexibility will help you manage the pressure and expectations that may come your way.",
  ],
};

export function BookReading({ author }: { author: string }) {
  return (
    <section id="reading" aria-labelledby="reading-title" className="container mt-24 scroll-mt-28">
      <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-[minmax(0,19rem)_1fr] md:gap-14">
        <div className="relative mx-auto w-[min(78vw,19rem)] md:w-full">
          <div className="overflow-hidden rounded-card border-2 border-ink bg-ink shadow-[6px_6px_0_#1a1917]">
            <video
              controls
              playsInline
              preload="none"
              poster={reading.poster}
              width={720}
              height={954}
              className="block aspect-[720/954] h-auto w-full"
              aria-label={`${author} reads from The Solo Scholar. ${reading.seconds} seconds, with captions.`}
            >
              <source src={reading.src} type="video/mp4" />
              <track kind="captions" src={reading.captions} srcLang="en" label="English" default />
            </video>
          </div>
          <span className="stamp absolute -top-3 -left-2 bg-paper text-ink" aria-hidden="true">
            Story hour
          </span>
        </div>

        <div className="text-center md:text-left">
          <p className="hand">Read aloud · {reading.seconds} seconds</p>
          <h2 id="reading-title" className="mt-2 text-3xl font-semibold">
            Pull up a chair. She reads you a page.
          </h2>
          <p className="mx-auto mt-4 max-w-[52ch] text-lg text-ink-2 md:mx-0">
            Every library has someone who reads to the room. Here it is the author, with a passage from the sophomore year chapter about making a plan and leaving room for detours.
          </p>
          <figure className="mx-auto mt-6 max-w-[46ch] border-l-4 border-gold pl-5 text-left md:mx-0">
            <blockquote className="display text-xl leading-snug">
              Think of your plan as a road map: having a clear destination in mind but willing to take detours when necessary.
            </blockquote>
            <figcaption className="mt-2 font-mono text-xs text-ink-3">{reading.source}</figcaption>
          </figure>
          <details className="mx-auto mt-6 max-w-[56ch] text-left md:mx-0">
            <summary className="cursor-pointer font-semibold underline decoration-2 underline-offset-4">Read the words instead</summary>
            <div className="mt-3 space-y-3 text-ink-2">
              {reading.transcript.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
