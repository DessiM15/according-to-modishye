import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { articleTemplate } from "./templates";
import { previewAction } from "./actions/previewAction";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

export default defineConfig({
  name: "modishye",
  title: "Modishye",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool({ title: "Query (developer)" })],
  schema: {
    types: schemaTypes,
    // Every new article starts from her template, so there is no blank page.
    templates: (prev) => [articleTemplate, ...prev.filter((t) => t.schemaType !== "article")],
  },
  document: {
    actions: (prev, ctx) => (["article", "guide", "legalPage"].includes(ctx.schemaType) ? [...prev, previewAction] : prev),
  },
});
