import { useEffect } from "react";
import type { LayoutProps } from "sanity";

const FONTS = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Instrument+Sans:wght@400;500;600&family=Caveat:wght@500&display=swap";

// Loads her fonts once for the whole studio, then renders Sanity's layout as normal.
export function Layout(props: LayoutProps) {
  useEffect(() => {
    if (document.querySelector('link[data-modishye-fonts]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS;
    link.setAttribute("data-modishye-fonts", "1");
    document.head.appendChild(link);
  }, []);
  return props.renderDefault(props);
}
