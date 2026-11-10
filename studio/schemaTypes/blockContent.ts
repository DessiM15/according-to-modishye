import { defineArrayMember, defineType } from "sanity";

// The only formatting the site supports. Anything else cannot be pasted in, which keeps the design intact.
export const blockContent = defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Section heading", value: "h2" },
        { title: "Small heading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullets", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "Web address",
                validation: (r) => r.required().uri({ scheme: ["http", "https", "mailto"], allowRelative: true }),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      title: "Image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Describe the image",
          description: "A sentence for readers who cannot see it. Google reads this too.",
          validation: (r) => r.required().error("Every image needs a description"),
        },
        { name: "caption", type: "string", title: "Caption (optional)" },
      ],
    }),
    defineArrayMember({ type: "youtube" }),
  ],
});
