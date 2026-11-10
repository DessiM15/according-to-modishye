"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Browsers restore the old scroll position on refresh, and Next scrolls new pages so the content sits under
// the sticky header. Guests should always land at the very top of the page they are on, unless the URL has a hash.
export function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    if (window.location.hash) return;
    window.scrollTo(0, 0);
    const raf = requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => cancelAnimationFrame(raf);
  }, [pathname]);
  return null;
}
