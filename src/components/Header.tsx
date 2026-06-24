"use client";

import Link from "next/link";
import { useState } from "react";
import { Wordmark } from "./Wordmark";

const nav = [
  { href: "/episodes", label: "Episodes" },
  { href: "/about", label: "About" },
  { href: "/specials", label: "Specials" },
  { href: "/articles", label: "Articles" },
  { href: "/sponsorship", label: "Sponsorship" },
  { href: "/subscribe", label: "Subscribe" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-maroon/95 backdrop-blur supports-[backdrop-filter]:bg-maroon/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6 md:py-2">
        <Wordmark />

        <nav className="hidden items-center gap-5 md:flex lg:gap-7">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-cream/90 transition hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/subscribe" className="btn-primary text-sm py-2 px-4">
            Listen
          </Link>
        </nav>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-md p-2 text-gold border border-gold/40"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-gold/20 bg-maroon-deep">
          <ul className="flex flex-col py-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-3 text-cream/90 hover:bg-maroon hover:text-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
