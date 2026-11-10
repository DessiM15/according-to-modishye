import type { DocumentActionComponent } from "sanity";
import { useClient } from "sanity";
import { EyeOpenIcon } from "@sanity/icons";
import { createPreviewSecret } from "@sanity/preview-url-secret/create-secret";

const siteUrl = process.env.SANITY_STUDIO_SITE_URL ?? "http://localhost:3000";

function pathFor(doc: { _type: string; slug?: { current?: string } }) {
  const slug = doc.slug?.current;
  if (!slug) return null;
  if (doc._type === "article") return `/articles/${slug}`;
  if (doc._type === "guide") return `/guides/${slug}`;
  if (doc._type === "legalPage") return `/${slug}`;
  return null;
}

// "Preview on site": opens the draft on the real site in a new tab, using a short-lived secret.
export const previewAction: DocumentActionComponent = (props) => {
  const client = useClient({ apiVersion: "2025-01-01" });
  const doc = (props.draft ?? props.published) as { _type: string; slug?: { current?: string } } | null;
  const path = doc ? pathFor(doc) : null;
  if (!path) return null;
  return {
    label: "Preview on site",
    icon: EyeOpenIcon,
    onHandle: async () => {
      const { secret } = await createPreviewSecret(client, "modishye-studio", window.location.origin);
      const url = new URL("/api/draft", siteUrl);
      url.searchParams.set("sanity-preview-secret", secret);
      url.searchParams.set("sanity-preview-pathname", path);
      window.open(url.toString(), "_blank", "noopener");
      props.onComplete();
    },
  };
};
