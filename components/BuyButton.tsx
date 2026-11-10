"use client";

import { useId, useState } from "react";

// Shopify Starter plan: each guide gets a product handle, and checkout runs on Shopify.
// Set NEXT_PUBLIC_SHOPIFY_DOMAIN (e.g. modishye.myshopify.com) and the handle per guide to go live.
export function BuyButton({ title, price, handle }: { title: string; price: number; handle: string | null }) {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const [open, setOpen] = useState(false);
  const noteId = useId();

  if (domain && handle) {
    return (
      <a href={`https://${domain}/products/${handle}`} className="btn btn-gold text-base" target="_blank" rel="noopener noreferrer">
        Get the guide · ${price}
        <span className="sr-only"> (opens Shopify checkout in a new tab)</span>
      </a>
    );
  }

  return (
    <div>
      <button type="button" className="btn btn-gold text-base" aria-expanded={open} aria-controls={noteId} onClick={() => setOpen((v) => !v)}>
        Get the guide · ${price}
      </button>
      <p id={noteId} hidden={!open} className="mt-3 max-w-md rounded-lg border border-line bg-paper-2 p-3 text-sm text-ink-2">
        Preview build. Secure checkout for {title} opens on Shopify once the store is connected at launch. Instant PDF delivery to your email.
      </p>
    </div>
  );
}
