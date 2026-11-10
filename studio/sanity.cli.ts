import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  },
  // Hosted at https://modishye.sanity.studio
  studioHost: "modishye",
  deployment: { appId: "wg1gz9op2er1xgh8cnk7dtpc", autoUpdates: true },
});
