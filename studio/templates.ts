import type { Template } from "sanity";

// Her WordPress habit: duplicate a post called "blogpost template" and fill it in.
// This is that template. Every new article starts with this shape.
let n = 0;
const key = () => `tpl${Date.now().toString(36)}${(n++).toString(36)}`;
const block = (style: string, text: string) => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

export const articleTemplate: Template = {
  id: "article-template",
  title: "Blog post",
  description: "Starts with the shape of her usual post: intro, sections, close.",
  schemaType: "article",
  value: () => ({
    publishedAt: new Date().toISOString(),
    body: [
      block("h2", "What this is about"),
      block("normal", "Two or three sentences on who this is for and what they will know by the end. Replace this text."),
      block("h2", "First point"),
      block("normal", "Tell the story. What happened, what you noticed, what you would do differently."),
      block("h2", "Second point"),
      block("normal", "Keep paragraphs short. One idea each. Add an image between sections if you have one."),
      block("h2", "Third point"),
      block("normal", "Replace or delete any section you do not need."),
      block("h2", "Where to go next"),
      block("normal", "Close with one thing the reader can do today. Link a guide or the book if it fits."),
    ],
  }),
};
