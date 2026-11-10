import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { articleTemplate } from "./templates";
import { previewAction } from "./actions/previewAction";
import { startTool } from "./tools/startTool";
import { theme } from "./theme";
import { Logo } from "./components/Logo";
import { Layout } from "./components/Layout";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";

export default defineConfig({
  name: "modishye",
  title: "Modishye",
  subtitle: "Publishing desk",
  icon: Logo,
  projectId,
  dataset,
  theme,
  studio: { components: { layout: Layout } },
  plugins: [structureTool({ name: "content", title: "Content", structure }), visionTool({ title: "Query (developer)" })],
  // The Start page is the first tool, so it is what opens. The query tool is for the agency only.
  tools: (prev, { currentUser }) => {
    const admin = currentUser?.roles.some((r) => r.name === "administrator") ?? false;
    return [startTool, ...prev.filter((t) => t.name !== "vision" || admin)];
  },
  schema: {
    types: schemaTypes,
    // Every new article starts from her template, so there is no blank page.
    templates: (prev) => [articleTemplate, ...prev.filter((t) => t.schemaType !== "article")],
  },
  document: {
    actions: (prev, ctx) => (["article", "guide", "legalPage"].includes(ctx.schemaType) ? [...prev, previewAction] : prev),
  },
});
