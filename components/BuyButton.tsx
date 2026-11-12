"use client";

import { useId, useState } from "react";

// Checkout runs on her WooCommerce store. The link adds the product to the cart and lands on checkout,
// so buyers never see the old WordPress theme's product page.
// Set NEXT_PUBLIC_WOO_URL to the store's address (e.g. https://shop.accordingtomodishyeblog.com) to go live.
export function BuyButton({ title, price, wooId }: { title: string; price: number; wooId: number | null }) {
  const store = process.env.NEXT_PUBLIC_WOO_URL?.replace(/\/+$/, "");
  const [open, setOpen] = useState(false);
  const noteId = useId();

  if (store && wooId) {
    return (
      <a href={`${store}/checkout/?add-to-cart=${wooId}`} className="btn btn-gold text-base" target="_blank" rel="noopener noreferrer">
        Get the guide · ${price}
        <span className="sr-only"> (opens secure checkout in a new tab)</span>
      </a>
    );
  }

  return (
    <div>
      <button type="button" className="btn btn-gold text-base" aria-expanded={open} aria-controls={noteId} onClick={() => setOpen((v) => !v)}>
        Get the guide · ${price}
      </button>
      <p id={noteId} hidden={!open} className="mt-3 max-w-md rounded-lg border border-line bg-paper-2 p-3 text-sm text-ink-2">
        Preview build. Secure checkout for {title} opens once the store is connected at launch. Instant PDF delivery to your email.
      </p>
    </div>
  );
}
