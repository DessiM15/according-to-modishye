"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="container flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3 no-underline" aria-label="Modishye home" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <Image src="/images/yeye-logo.png" alt="" width={40} height={40} className="h-10 w-10 rounded-full bg-paper-2 object-cover object-top" priority />
          <span className="display text-xl font-semibold tracking-tight text-ink">Modishye</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-full px-4 font-mono text-sm no-underline transition-colors ${
                      active ? "bg-ink text-paper" : "text-ink hover:bg-paper-3"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="ml-2">
              <Link href="/#newsletter" className="btn btn-gold py-2.5">
                Subscribe
              </Link>
            </li>
          </ul>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="lg:hidden inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 border-ink px-4 font-mono text-sm"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 z-40 overflow-y-auto bg-paper"
      >
        <nav aria-label="Main mobile" className="container py-6">
          <ul className="flex flex-col gap-2">
            {nav.map((item, i) => (
              <li key={item.href}>
                <Link
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="display block rounded-xl border-b border-line py-4 text-2xl text-ink no-underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link href="/#newsletter" onClick={() => setOpen(false)} className="btn btn-gold w-full justify-center">
                Subscribe to the newsletter
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
