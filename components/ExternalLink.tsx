import type { AnchorHTMLAttributes } from "react";

// Every link that leaves the site says so for screen readers and keeps the opener safe.
export function ExternalLink({ children, className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...rest} className={className} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
