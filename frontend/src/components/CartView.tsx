"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { useCart } from "@/components/CartProvider";
import { formatNumber, formatPrice } from "@/lib/format";
import { btnPrimary } from "@/lib/shop";

export function CartView() {
  const { lines, total, ready, setQty, remove } = useCart();

  if (!ready) {
    return <p className="py-16 text-center text-sm text-muted">در حال خواندن سبد...</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-3xl font-semibold text-cocoa">سبد خرید خالی است</h1>
        <p className="mt-3 text-sm leading-8 text-muted">از دسته‌های کادویی یا فله یک محصول انتخاب کنید.</p>
        <Link href="/products" className={`${btnPrimary} mt-6`}>
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
      <ul className="divide-y divide-line border border-line">
        {lines.map((line) => (
          <li key={line.productId} className="flex gap-4 p-4">
            <Link href={`/products/${line.slug}`} className="shrink-0">
              <ProductImage
                src={line.imageUrl}
                alt=""
                slug={line.slug}
                category={line.unit === "کیلوگرم" ? "bulk" : line.unit === "عدد" ? "bar" : "gift"}
                className="h-24 w-24"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/products/${line.slug}`} className="font-medium hover:text-gold">
                {line.name}
              </Link>
              <p className="mt-1 text-sm text-muted">
                {formatPrice(line.price)} / {line.unit}
              </p>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <button
                  type="button"
                  className="border border-line px-2 py-1"
                  onClick={() => setQty(line.productId, line.quantity - 1)}
                  aria-label="کم کردن"
                >
                  −
                </button>
                <span>{formatNumber(line.quantity)}</span>
                <button
                  type="button"
                  className="border border-line px-2 py-1 disabled:text-muted"
                  disabled={line.quantity >= line.stock}
                  onClick={() => setQty(line.productId, line.quantity + 1)}
                  aria-label="زیاد کردن"
                >
                  +
                </button>
                <button type="button" className="text-muted hover:text-cocoa" onClick={() => remove(line.productId)}>
                  حذف
                </button>
              </div>
            </div>
            <p className="text-sm text-cocoa">{formatPrice(line.price * line.quantity)}</p>
          </li>
        ))}
      </ul>
      <aside className="h-fit border border-line bg-cream p-5">
        <h2 className="text-lg font-semibold">جمع سبد</h2>
        <p className="mt-4 flex justify-between text-sm">
          <span>مبلغ قابل پرداخت</span>
          <span>{formatPrice(total)}</span>
        </p>
        <p className="mt-3 text-xs leading-6 text-muted">پرداخت هنگام تحویل یا با هماهنگی تلفنی انجام می‌شود.</p>
        <Link href="/checkout" className={`${btnPrimary} mt-5 w-full`}>
          ثبت سفارش
        </Link>
      </aside>
    </div>
  );
}
