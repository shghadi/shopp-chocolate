"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatNumber } from "@/lib/format";
import { shop } from "@/lib/shop";

const links = [
  { href: "/", label: "خانه" },
  { href: "/products", label: "محصولات" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس با ما" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="bg-olive text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs">
          <p className="hidden sm:block">جعبه هدیه و شکلات فله، با بسته‌بندی مرتب</p>
          <p className="flex gap-3">
            <a href={shop.phoneHref}>{shop.phone}</a>
            <span aria-hidden>|</span>
            <a href={`mailto:${shop.email}`}>{shop.email}</a>
          </p>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center border border-gold text-lg text-cocoa">ز</span>
          <span>
            <span className="block text-[10px] tracking-[0.28em] text-gold">{shop.en}</span>
            <span className="block text-lg font-semibold leading-none text-cocoa">{shop.name}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={active ? "text-gold" : "hover:text-gold"}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative text-sm text-cocoa hover:text-gold">
            سبد
            {ready && count > 0 ? (
              <span className="absolute -top-3 -left-4 grid h-5 min-w-5 place-items-center bg-cocoa px-1 text-[10px] text-white">
                {formatNumber(count)}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="border border-line px-3 py-1 text-sm md:hidden"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            منو
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-line px-4 py-3 md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="block py-2 text-sm">
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
