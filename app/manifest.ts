import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MODISHYE",
    short_name: "MODISHYE",
    description: "The college library for the only child in the room.",
    start_url: "/",
    display: "browser",
    background_color: "#fbf7ee",
    theme_color: "#fbf7ee",
    icons: [{ src: "/images/yeye-logo.png", sizes: "512x512", type: "image/png" }],
  };
}
