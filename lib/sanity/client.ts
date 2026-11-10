import { createClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2025-01-01";

// With no project id the site reads content/*.json, which is how the mockup runs.
export const hasSanity = Boolean(projectId);

// useCdn is off on purpose: Next caches the query result itself, and the publish webhook must see the
// change immediately. Sanity's CDN can lag a mutation by a few seconds, which is enough to rebuild a stale page.
export const client = createClient({
  projectId: projectId ?? "unset",
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});

// Reads drafts. Only used when preview mode is on, and only on the server.
export const draftClient = client.withConfig({
  useCdn: false,
  perspective: "drafts",
  token: process.env.SANITY_API_READ_TOKEN,
});
