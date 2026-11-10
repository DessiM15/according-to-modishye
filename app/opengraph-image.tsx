import { brandImage, ogSize } from "@/lib/og";

export const alt = "Modishye: the college library for the only child in the room";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return brandImage({
    eyebrow: "Modishye Library · Est. 2019",
    title: "The college library for the only child in the room.",
    footer: "By Yeyeside Talabi · accordingtomodishyeblog.com",
    colour: "#ffd23f",
  });
}
