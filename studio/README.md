# Modishye portal (Sanity Studio)

Her publishing portal. A separate package so the site build never carries the editor.

## What she sees

- Articles, Articles by shelf, Guides (shop), Legal pages. Nothing else.
- New article opens pre-filled with her blog post shape (`templates.ts`): intro heading, three sections, close.
- The editor allows paragraph, section heading, small heading, quote, bullets, numbers, bold, italic, link, image, YouTube. Nothing else, so the site design cannot be broken from the portal.
- Title, shelf, cover image and image descriptions are required. Slug, dates, reading time and search description are generated, with a Google tab to override the description.
- "Preview on site" on any document opens the unpublished draft on the real site in a new tab. Publish goes live within seconds through the webhook.

## Set up once

```bash
cd studio
npm install
npx sanity login                      # her Google account, or yours as the agency
npx sanity init --env                 # creates the project and writes SANITY_STUDIO_PROJECT_ID to .env
npm run dev                           # http://localhost:3333
npx sanity deploy                     # pick the hostname, e.g. modishye -> https://modishye.sanity.studio
```

Then in sanity.io/manage:

1. Members: invite her email as Editor. Keep the agency as Administrator.
2. API > CORS origins: add the site URL and `http://localhost:3000`, credentials allowed.
3. API > Tokens: one Viewer token (site preview) and one Editor token (migration, delete after).
4. API > Webhooks: URL `https://<site>/api/revalidate`, dataset `production`, trigger on create, update and delete, secret equal to `SANITY_REVALIDATE_SECRET` on the site.

Environment, see `.env.example`: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_STUDIO_SITE_URL` (where Preview opens).

## Files

| File | What |
|---|---|
| `sanity.config.ts` | Plugins, schema, template override, preview action |
| `schemaTypes/article.ts` | The article form, grouped into Write and Google |
| `schemaTypes/guide.ts` | Guide page text, price shown on the site, Shopify handle |
| `schemaTypes/legalPage.ts` | Privacy, terms, refunds, cookies |
| `schemaTypes/blockContent.ts` | The allowed formatting |
| `templates.ts` | Her blog post template |
| `structure.ts` | The left column |
| `actions/previewAction.ts` | Preview on site, using a short-lived secret |
| `shelves.ts` | The five shelves. Must match `content/shelves.json` in the site |

Changing the five shelves means editing both `shelves.ts` here and `content/shelves.json` in the site, then redeploying both.
