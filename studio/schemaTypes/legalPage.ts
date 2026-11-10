import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  icon: DocumentIcon,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Web address", type: "slug", options: { source: "title", maxLength: 60 }, validation: (r) => r.required() }),
    defineField({ name: "body", title: "Text", type: "blockContent", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title", slug: "slug.current" }, prepare: ({ title, slug }) => ({ title, subtitle: `/${slug ?? ""}` }) },
});
