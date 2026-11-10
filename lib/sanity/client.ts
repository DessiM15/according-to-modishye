import { createClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2025-01-01";

// With no project id the site reads content/*.json, which is how the mockup runs.
export const hasSanity = Boolean(projectId);

export const client = createClient({
  projectId: projectId ?? "unset",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

// Reads drafts. Only used when preview mode is on, and only on the server.
export const draftClient = client.withConfig({
  useCdn: false,
  perspective: "drafts",
  token: process.env.SANITY_API_READ_TOKEN,
});
