import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  },
  // Hosted at <studioHost>.sanity.studio. Pick the name once with `npx sanity deploy`.
  deployment: { autoUpdates: true },
});
