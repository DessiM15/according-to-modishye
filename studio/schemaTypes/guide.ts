import { defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons";
import { colours, shelves } from "../shelves";

export const guide = defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  icon: BookIcon,
  groups: [
    { name: "page", title: "Guide page", default: true },
    { name: "shop", title: "Shop" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "page", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "One-line summary", type: "string", group: "page", description: "Shows under the title, e.g. Three pages of coping strategies, prompts and checklists.", validation: (r) => r.required() }),
    defineField({ name: "shelf", title: "Shelf", type: "string", group: "page", options: { list: shelves, layout: "radio" }, validation: (r) => r.required() }),
    defineField({ name: "colour", title: "Frame colour", type: "string", group: "page", options: { list: colours, layout: "radio" }, validation: (r) => r.required() }),
    defineField({
      name: "image",
      title: "Cover",
      type: "image",
      group: "page",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Describe the image", validation: (r) => r.required() })],
      validation: (r) => r.required(),
    }),
    defineField({ name: "pages", title: "Format", type: "string", group: "page", description: "e.g. 3-page PDF", validation: (r) => r.required() }),
    defineField({ name: "audience", title: "Who it is for", type: "string", group: "page", description: "e.g. First-year students away from home", validation: (r) => r.required() }),
    defineField({ name: "description", title: "Short description", type: "text", rows: 3, group: "page", description: "Used on the shelf card and on Google.", validation: (r) => r.required().max(300) }),
    defineField({ name: "body", title: "Full description", type: "blockContent", group: "page" }),
    defineField({ name: "price", title: "Price (USD)", type: "number", group: "shop", description: "Shown on the site. The price people are charged is set in Shopify, keep the two the same.", validation: (r) => r.required().positive() }),
    defineField({
      name: "shopifyHandle",
      title: "Shopify product handle",
      type: "string",
      group: "shop",
      description: "The last part of the product's URL in Shopify. Leave empty until the product exists in Shopify.",
    }),
    defineField({ name: "order", title: "Order on the shelf", type: "number", group: "shop", description: "Lower numbers show first.", initialValue: 10 }),
    defineField({ name: "slug", title: "Web address", type: "slug", group: "shop", options: { source: "title", maxLength: 80 }, validation: (r) => r.required() }),
    defineField({ name: "currency", title: "Currency", type: "string", group: "shop", initialValue: "USD", readOnly: true }),
    defineField({ name: "legacySlug", title: "Old WordPress address", type: "string", group: "shop", readOnly: true, hidden: ({ value }) => !value }),
    defineField({ name: "wooId", title: "Old WooCommerce id", type: "number", group: "shop", readOnly: true, hidden: ({ value }) => !value }),
  ],
  orderings: [{ title: "Shelf order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", price: "price", media: "image" },
    prepare: ({ title, price, media }) => ({ title, subtitle: price ? `$${price}` : "", media }),
  },
});
