import { brandImage, ogSize } from "@/lib/og";
import { getPost, getPosts, getShelf } from "@/lib/content";
import { colours } from "@/lib/site";

export const size = ogSize;
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  const shelf = post ? getShelf(post.shelf) : undefined;
  return brandImage({
    eyebrow: shelf ? `${shelf.chapter} · ${shelf.title}` : "Modishye Library",
    title: post?.title ?? "Modishye",
    footer: `By Yeyeside Talabi · ${post?.readingMinutes ?? 3} min read`,
    colour: shelf ? colours[shelf.colour].hex : "#ffd23f",
  });
}
