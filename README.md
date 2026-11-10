# Modishye: site rebuild

Next.js rebuild of accordingtomodishyeblog.com for Yeyeside Talabi. Status: build phase. Every page, link, form and redirect works. Content comes from her Sanity portal when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, otherwise from `content/*.json`. Third-party services run in preview mode until their keys are added.

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
| `lib/content.ts` | The only place pages read content from. Reads Sanity when configured, otherwise the JSON |
| `lib/sanity/` | Sanity client, GROQ query, Portable Text to HTML, and the mapping to the same `Post`, `Guide` and `LegalPage` types the pages already use |
| `studio/` | Her publishing portal (Sanity Studio). Own package, deployed to `*.sanity.studio`. See `studio/README.md` |
| `scripts/migrate-to-sanity.mjs` | One-time move of `content/*.json` into Sanity: uploads images, converts HTML to Portable Text |
| `docs/how-to-publish.md` | The one-page guide for her |
| `lib/seo.ts` | JSON-LD builders: Organization, Person, WebSite, BlogPosting, Product, Book, CollectionPage, BreadcrumbList |

## Services and the keys they need

Copy `.env.example` to `.env.local`. Without a key, each feature works in preview mode and says so.

| Feature | Env vars | Where she gets them |
|---|---|---|
| Newsletter (Mailchimp, double opt-in, tagged by stage) | `MAILCHIMP_API_KEY`, `MAILCHIMP_SERVER_PREFIX`, `MAILCHIMP_AUDIENCE_ID` | Mailchimp > Account > Extras > API keys. Audience ID under Audience > Settings |
| Contact form delivery (Web3Forms) | `WEB3FORMS_ACCESS_KEY` | web3forms.com, key registered to support@accordingtomodishyeblog.com. Speaking requests arrive with the subject "Speaking request: <school>" |
| Guide checkout (Shopify Starter, 5 USD a month) | `NEXT_PUBLIC_SHOPIFY_DOMAIN`, plus `shopifyHandle` per guide in `content/guides.json` | Shopify admin after she creates the six products with the Digital Downloads app |
| Canonical URL | `NEXT_PUBLIC_SITE_URL` | Defaults to the current domain |
| Portal content (Sanity) | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | sanity.io/manage after `npx sanity init` in `studio/` |
| Draft preview from the portal | `SANITY_API_READ_TOKEN` | sanity.io/manage > API > Tokens, Viewer role |
| Publish refreshes the site | `SANITY_REVALIDATE_SECRET` | Any long random string, pasted into the webhook in sanity.io/manage > API > Webhooks (URL `/api/revalidate`, trigger on create, update, delete, dataset `production`) |
| `/studio` and `/wp-admin` redirect | `NEXT_PUBLIC_SANITY_STUDIO_URL` | The hosted studio URL from `npx sanity deploy` |

## Launch checklist

Done on 10 Nov 2026: Sanity project `uvpgl52r` (dataset `production`), studio deployed at https://modishye.sanity.studio, all 35 documents and 44 images migrated, publish webhook live, Sanity env vars set on both Vercel projects for production and preview. Publish, edit and delete reach the live site within about ten seconds. Preview on site verified end to end.

1. Invite her email to the Sanity project as Editor (sanity.io/manage > project > Members). Walk her through `docs/how-to-publish.md` on a call and record it.
2. Shopify Starter: create the six products, upload the PDFs, paste each handle into the guide in the portal (Shop tab). Set `NEXT_PUBLIC_SHOPIFY_DOMAIN`.
3. Mailchimp keys.
4. Vercel Pro (commercial use). Point DNS. Keep her existing email: move the MX records with the domain.
5. At cutover, three URL changes: the webhook URL in sanity.io/manage > API > Webhooks to `https://www.accordingtomodishyeblog.com/api/revalidate`; `SANITY_STUDIO_SITE_URL` in `studio/.env.production` then `npx sanity deploy`; `NEXT_PUBLIC_SITE_URL` on Vercel.
6. Before cutover, re-run `scripts/import-wp.mjs` against the live site and check for posts she published after 10 Nov 2026. Add any new ones through the portal rather than re-running the migration, which would overwrite her portal edits.
7. Google Search Console: verify the new site, submit `/sitemap.xml`. The 97 redirects in `content/redirects.json` carry the old URLs over.
8. Replace `public/images/solo-scholar-cover.png` with the real cover art when she sends it.
9. Delete the Editor token "Migration (editor)" in sanity.io/manage once the content is final.

Notes from setup: the site reads Sanity with `useCdn: false` and the webhook calls `revalidateTag(tag, { expire: 0 })` plus `revalidatePath("/", "layout")`. With the CDN on or with the `"max"` profile, pages rebuilt from stale data and a deleted article kept serving. Vercel preview env vars had to be added through the REST API; the CLI kept asking for a branch.

## Accessibility and SEO baseline

`node scripts/qa.mjs` passes with zero axe violations (WCAG 2.2 AA plus best practice) and zero horizontal overflow at 320, 375, 414, 768, 1024, 1280, 1536 and 1920 px on 11 page types. The brand magenta needs pure black text to pass AA. Every page has one h1, one main landmark, a skip link, visible focus, titled iframes, labelled links, and pinch zoom enabled.
