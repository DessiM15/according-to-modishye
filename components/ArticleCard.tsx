import Link from "next/link";
import Image from "next/image";
import type { Post, Shelf } from "@/lib/content";
import { colours, formatDate } from "@/lib/site";

export function ArticleCard({ post, shelf, priority = false, headingLevel = 3 }: { post: Post; shelf?: Shelf; priority?: boolean; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition-shadow hover:shadow-lift">
      <Link href={`/articles/${post.slug}`} className="no-underline" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-[1.9/1] bg-paper-2">
          {post.cover ? (
            <Image src={post.cover} alt="" fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" className="object-cover" priority={priority} />
          ) : (
            <div className="absolute inset-0" style={{ background: shelf ? colours[shelf.colour].hex : "#e8dec6" }} />
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {shelf && (
          <span className="stamp self-start" style={{ color: colours[shelf.colour].ink, background: colours[shelf.colour].hex, borderColor: "transparent" }}>
            {shelf.title}
          </span>
        )}
        <Heading className="mt-3 text-xl font-semibold leading-tight">
          <Link href={`/articles/${post.slug}`} className="text-ink no-underline group-hover:underline decoration-2 underline-offset-4">
            {post.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-3 text-ink-2">{post.excerpt}</p>
        <p className="mt-auto pt-4 font-mono text-xs text-ink-3">
          <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.video ? "Video + " : ""}
          {post.readingMinutes} min read
        </p>
      </div>
    </article>
  );
}
