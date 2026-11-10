import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { shelves } from "../shelves";

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "write", title: "Write", default: true },
    { name: "search", title: "Google" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "write",
      description: "Say what the reader gets. Under 70 characters shows in full on Google.",
      validation: (r) => r.required().max(110).warning("Titles over 70 characters get cut off in search results"),
    }),
    defineField({
      name: "shelf",
      title: "Shelf",
      type: "string",
      group: "write",
      description: "Which chapter of the library this belongs on.",
      options: { list: shelves, layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "cover",
      title: "Cover image",
      type: "image",
      group: "write",
      description: "Shows at the top of the article and on the shelf. Landscape works best.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Describe the image",
          validation: (r) => r.required().error("Add a one-line description of the cover"),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body",
      title: "Article",
      type: "blockContent",
      group: "write",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "video",
      title: "YouTube video (optional)",
      type: "url",
      group: "write",
      description: "If this article has a matching video, paste the link and it is embedded above the text.",
      validation: (r) => r.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      group: "write",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "search",
      description: "Made from the title. Click Generate after changing the title. Do not change it after publishing, the old link would stop working.",
      options: { source: "title", maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Search description",
      type: "text",
      rows: 3,
      group: "search",
      description: "One or two sentences shown under the title on Google. Left empty, the first paragraph is used.",
      validation: (r) => r.max(160).warning("Google cuts descriptions off around 155 characters"),
    }),
    defineField({ name: "categories", title: "Old WordPress categories", type: "array", of: [{ type: "string" }], group: "search", readOnly: true, hidden: ({ value }) => !value }),
    defineField({ name: "legacySlug", title: "Old WordPress address", type: "string", group: "search", readOnly: true, hidden: ({ value }) => !value }),
  ],
  orderings: [{ title: "Newest first", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", shelf: "shelf", media: "cover", date: "publishedAt" },
    prepare({ title, shelf, media, date }) {
      const s = shelves.find((x) => x.value === shelf)?.title.replace(/^Chapter \w+: /, "");
      return { title, subtitle: [s, date ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null].filter(Boolean).join(" · "), media };
    },
  },
});
