"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cn } from "./cn";
import { Cart, Close, Menu, Search } from "./icons";
import { IconButton } from "./IconButton";
import { Logo } from "./Logo";

export type NavItem = { label: string; href: string };

/** SiteHeader — see specs/site-header.md */
export function SiteHeader({
  items,
  cartCount = 0,
  account,
}: {
  items: NavItem[];
  cartCount?: number;
  /** Avatar or sign-in link, rendered at the far right. */
  account?: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-roast-700/60 bg-roast-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 w-full max-w-site items-center gap-6 px-gutter sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="mx-auto hidden md:block">
          <ul className="flex gap-8">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="text-caption font-medium text-foam-100 transition-colors hover:text-crema-300 aria-[current=page]:text-crema-500"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <IconButton label="Search" tone="ghost">
            <Search />
          </IconButton>
          <Link
            href="/cart"
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
            className="relative inline-grid size-10 place-items-center rounded-full text-foam-50 hover:bg-foam-50/10 hover:text-crema-300"
          >
            <Cart />
            {cartCount > 0 && (
              <span
                aria-hidden
                className="absolute top-1 right-1 grid min-w-4 place-items-center rounded-full bg-crema-500 px-1 text-[0.625rem] font-bold text-ink"
              >
                {cartCount}
              </span>
            )}
          </Link>
          {account && <div className="ml-2 hidden sm:block">{account}</div>}
          <IconButton
            label={open ? "Close menu" : "Open menu"}
            tone="ghost"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Close /> : <Menu />}
          </IconButton>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!open}
        className="border-t border-roast-700/60 md:hidden"
      >
        <ul className="flex flex-col px-gutter py-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "flex h-12 items-center text-lead font-medium text-foam-50",
                  "aria-[current=page]:text-crema-500",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
