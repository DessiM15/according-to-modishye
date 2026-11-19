import { defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons/Book";
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
    defineField({ name: "price", title: "Price (USD)", type: "number", group: "shop", description: "Only used if the shop cannot be reached. The site shows the price set in WooCommerce.", validation: (r) => r.required().positive() }),
    defineField({
      name: "wooId",
      title: "WooCommerce product number",
      type: "number",
      group: "shop",
      description: "Connects the Get the guide button to the product in WooCommerce. In WooCommerce, open Products and hover over the product: the number after ID is what goes here. Products added in WooCommerce show on the site on their own. Fill this in to link this guide to its product, so the site uses the text and cover from here.",
      validation: (r) => r.integer().positive(),
    }),
    defineField({ name: "order", title: "Order on the shelf", type: "number", group: "shop", description: "Lower numbers show first.", initialValue: 10 }),
    defineField({ name: "slug", title: "Web address", type: "slug", group: "shop", options: { source: "title", maxLength: 80 }, validation: (r) => r.required() }),
    defineField({ name: "currency", title: "Currency", type: "string", group: "shop", initialValue: "USD", readOnly: true }),
    defineField({ name: "legacySlug", title: "Old WordPress address", type: "string", group: "shop", readOnly: true, hidden: ({ value }) => !value }),
  ],
  orderings: [{ title: "Shelf order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", price: "price", media: "image" },
    prepare: ({ title, price, media }) => ({ title, subtitle: price ? `$${price}` : "", media }),
  },
});
