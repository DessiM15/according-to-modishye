import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons/Play";

export const youtube = defineType({
  name: "youtube",
  title: "YouTube video",
  type: "object",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "url",
      title: "YouTube link",
      type: "url",
      description: "Paste the link from the address bar or the Share button.",
      validation: (r) =>
        r
          .required()
          .uri({ scheme: ["https"] })
          .custom((v) => (!v || /youtu\.be\/|youtube\.com\//.test(v) ? true : "This needs to be a YouTube link")),
    }),
  ],
  preview: {
    select: { url: "url" },
    prepare: ({ url }) => ({ title: "YouTube video", subtitle: url }),
  },
});
