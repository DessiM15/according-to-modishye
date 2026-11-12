import { site } from "@/lib/site";
import type { Guide, Post, Shelf } from "@/lib/content";
import { reading } from "@/components/BookReading";

const abs = (path: string) => new URL(path, site.url).toString();

export const personId = abs("/#person");
export const orgId = abs("/#organization");
export const siteId = abs("/#website");

export function personLd() {
  return {
    "@type": "Person",
    "@id": personId,
    name: site.author.name,
    alternateName: "Modishye",
    url: abs("/about"),
    jobTitle: "Writer and author",
    description:
      "Nigerian, Namibian and South African writer. Went from a Nigerian boarding school to graduating high school in Texas at 16, then community college, a private college and graduate school. Author of The Solo Scholar.",
    sameAs: [site.social.youtube, site.social.x, site.social.snapchat, site.book.amazon],
    worksFor: { "@id": orgId },
  };
}

export function organizationLd() {
  return {
    "@type": "Organization",
    "@id": orgId,
    name: site.legalName,
    alternateName: "Modishye",
    url: site.url,
    logo: { "@type": "ImageObject", url: abs("/images/yeye-logo.png") },
    email: site.email,
    founder: { "@id": personId },
    foundingDate: site.founded,
    sameAs: [site.social.youtube, site.social.x, site.social.snapchat],
  };
}

export function websiteLd() {
  return {
    "@type": "WebSite",
    "@id": siteId,
    url: site.url,
    name: site.name,
    description: site.tagline,
    publisher: { "@id": orgId },
    inLanguage: "en-US",
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function articleLd(post: Post, shelf: Shelf | undefined) {
  return {
    "@type": "BlogPosting",
    "@id": abs(`/articles/${post.slug}#article`),
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.modified,
    wordCount: post.words,
    articleSection: shelf?.title,
    keywords: [shelf?.title, ...post.categories].filter(Boolean).join(", "),
    image: post.cover ? [abs(post.cover)] : undefined,
    author: { "@id": personId },
    publisher: { "@id": orgId },
    isPartOf: { "@id": siteId },
    mainEntityOfPage: abs(`/articles/${post.slug}`),
    inLanguage: "en-US",
    ...(post.video
      ? {
          video: {
            "@type": "VideoObject",
            name: post.title,
            description: post.description,
            thumbnailUrl: `https://i.ytimg.com/vi/${post.video}/hqdefault.jpg`,
            embedUrl: `https://www.youtube-nocookie.com/embed/${post.video}`,
            uploadDate: post.date,
          },
        }
      : {}),
  };
}

export function productLd(guide: Guide) {
  return {
    "@type": "Product",
    "@id": abs(`/guides/${guide.slug}#product`),
    name: `${guide.title}: ${guide.subtitle}`,
    description: guide.description,
    image: guide.image ? [abs(guide.image)] : undefined,
    brand: { "@type": "Brand", name: "Modishye" },
    category: "Digital download",
    offers: {
      "@type": "Offer",
      url: abs(`/guides/${guide.slug}`),
      price: guide.price.toFixed(2),
      priceCurrency: guide.currency,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": orgId },
    },
  };
}

export function bookLd() {
  return {
    "@type": "Book",
    "@id": abs("/the-solo-scholar#book"),
    name: `${site.book.title}: ${site.book.subtitle}`,
    author: { "@id": personId },
    url: abs("/the-solo-scholar"),
    bookFormat: ["https://schema.org/Paperback", "https://schema.org/EBook"],
    datePublished: site.book.published,
    inLanguage: "en",
    about: "Thriving in college as an only child",
    offers: {
      "@type": "Offer",
      url: site.book.amazon,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "Amazon" },
    },
  };
}

// The author reading a page of the book on /the-solo-scholar.
export function readingLd() {
  return {
    "@type": "VideoObject",
    "@id": abs("/the-solo-scholar#reading"),
    name: `${site.author.name} reads from ${site.book.title}`,
    description: `A ${reading.seconds} second reading from the sophomore year chapter of ${site.book.title}: ${site.book.subtitle}, about making a plan and staying flexible.`,
    thumbnailUrl: abs(reading.poster),
    contentUrl: abs(reading.src),
    uploadDate: reading.uploaded,
    duration: `PT${reading.seconds}S`,
    inLanguage: "en",
    transcript: reading.transcript.join(" "),
    creator: { "@id": personId },
    about: { "@id": abs("/the-solo-scholar#book") },
  };
}

export function collectionLd(shelf: Shelf, posts: Post[]) {
  return {
    "@type": "CollectionPage",
    "@id": abs(`/library/${shelf.slug}`),
    name: shelf.title,
    description: shelf.description,
    isPartOf: { "@id": siteId },
    hasPart: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: abs(`/articles/${p.slug}`) })),
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
