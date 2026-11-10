"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cn } from "./cn";
import { Close, Menu } from "./icons";
import { IconButton } from "./IconButton";
import { Logo } from "./Logo";

export type NavItem = { label: string; href: string };

/** SiteHeader — see specs/site-header.md */
export function SiteHeader({
  items,
  utilities,
  cta,
  account,
}: {
  items: NavItem[];
  /** 40px icon controls before the cta, e.g. <SearchDialog /> and <CartDrawer />. Visible at every width. */
  utilities?: ReactNode;
  /** Primary action, e.g. a "Reserve a table" button. In the row from `sm`; below that it moves into the menu panel. */
  cta?: ReactNode;
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
                  className="text-caption font-medium text-foam-100 transition-colors duration-150 ease-settle hover:text-crema-300 aria-[current=page]:text-crema-500"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {utilities}
          {cta && <div className="ml-1 hidden sm:block">{cta}</div>}
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

      <div id="mobile-nav" hidden={!open} className="border-t border-roast-700/60 md:hidden">
        <nav aria-label="Main">
          <ul className="flex flex-col px-gutter py-2 sm:px-6">
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
        {cta && <div className="border-t border-roast-700/60 px-gutter py-4 sm:hidden">{cta}</div>}
      </div>
    </header>
  );
}
