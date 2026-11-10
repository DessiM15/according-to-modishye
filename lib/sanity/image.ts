import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "./client";

const builder = createImageUrlBuilder({ projectId: projectId ?? "unset", dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}
