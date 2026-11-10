# Modishye: site rebuild

Next.js rebuild of accordingtomodishyeblog.com for Yeyeside Talabi. Status: high-functioning mockup. Every page, link, form and redirect works. Third-party services run in preview mode until their keys are added.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
node scripts/qa.mjs http://localhost:3000   # screenshots at 8 widths, axe scan, overflow check
```

## What is in here

| Path | What |
|---|---|
| `app/` | Pages. Home, `/library`, `/library/[shelf]`, `/articles/[slug]`, `/guides`, `/guides/[slug]`, `/the-solo-scholar`, `/about`, `/contact`, legal pages, accessibility statement, sitemap, robots, manifest, Open Graph images |
| `components/` | Hero, LibraryShelf (her sketch: pull a book, articles appear), Bookcase, cards, forms, lite YouTube embed, intro card |
| `content/` | Her 25 articles, 6 guides and 4 legal pages as clean JSON, plus `shelves.json` (the five shelves and which article sits on which) and `redirects.json` (97 old URLs) |
| `scripts/import-wp.mjs` | Pulls posts, products and pages from the WordPress API, strips Divi and Elementor markup, downloads images, applies titles and slugs from `shelves.json`. Run it again at launch against the live site |
| `lib/content.ts` | The only place pages read content from. Swap the JSON reads for Sanity queries at launch and nothing else changes |
| `lib/seo.ts` | JSON-LD builders: Organization, Person, WebSite, BlogPosting, Product, Book, CollectionPage, BreadcrumbList |

## Services and the keys they need

Copy `.env.example` to `.env.local`. Without a key, each feature works in preview mode and says so.

| Feature | Env vars | Where she gets them |
|---|---|---|
| Newsletter (Mailchimp, double opt-in, tagged by stage) | `MAILCHIMP_API_KEY`, `MAILCHIMP_SERVER_PREFIX`, `MAILCHIMP_AUDIENCE_ID` | Mailchimp > Account > Extras > API keys. Audience ID under Audience > Settings |
| Contact form delivery (Resend) | `RESEND_API_KEY`, `CONTACT_TO` | resend.com, free tier, verify her domain |
| Guide checkout (Shopify Starter, 5 USD a month) | `NEXT_PUBLIC_SHOPIFY_DOMAIN`, plus `shopifyHandle` per guide in `content/guides.json` | Shopify admin after she creates the six products with the Digital Downloads app |
| Canonical URL | `NEXT_PUBLIC_SITE_URL` | Defaults to the current domain |

## Launch checklist

1. Sanity project: create, port the schema (post, shelf, guide), mount Studio at `/studio`, point `lib/content.ts` at it. She then publishes without touching code.
2. Re-run `scripts/import-wp.mjs` against the live site so the latest posts carry over, then push the content into Sanity.
3. Shopify Starter: create the six products, upload the PDFs, paste handles into `content/guides.json`.
4. Mailchimp and Resend keys.
5. Vercel Pro (commercial use) or Cloudflare. Point DNS. Keep her existing email.
6. Google Search Console: verify the new site, submit `/sitemap.xml`. The 97 redirects in `content/redirects.json` carry the old URLs over.
7. Replace the CSS book cover in `components/BookCover.tsx` with the real cover art when she sends it.

## Accessibility and SEO baseline

`node scripts/qa.mjs` passes with zero axe violations (WCAG 2.2 AA plus best practice) and zero horizontal overflow at 320, 375, 414, 768, 1024, 1280, 1536 and 1920 px on 11 page types. The brand magenta needs pure black text to pass AA. Every page has one h1, one main landmark, a skip link, visible focus, titled iframes, labelled links, and pinch zoom enabled.
