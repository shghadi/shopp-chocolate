"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatNumber, formatPrice } from "@/lib/format";
import { btnGhost } from "@/lib/shop";
import type { OrderResult } from "@/lib/types";

export function OrderSuccess() {
  const { clear } = useCart();
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    clear();
    const raw = window.sessionStorage.getItem("zarrin-last-order");
    if (raw) {
      try {
        setOrder(JSON.parse(raw) as OrderResult);
      } catch {
        setOrder(null);
      }
    }
    setReady(true);
  }, [clear]);

  if (!ready) return <p className="py-10 text-sm text-muted">در حال نمایش سفارش...</p>;

  if (!order) {
    return (
      <div className="py-10">
        <h1 className="text-3xl font-semibold text-cocoa">سفارش ثبت شد</h1>
        <p className="mt-3 text-sm leading-8 text-muted">اگر جزئیات را نمی‌بینید، از صفحه محصولات ادامه دهید.</p>
        <Link href="/products" className={`${btnGhost} mt-6`}>
          بازگشت به محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs tracking-[0.2em] text-gold">سفارش ثبت شد</p>
      <h1 className="mt-2 text-3xl font-semibold text-cocoa">شماره {formatNumber(order.id)}</h1>
      <p className="mt-3 text-sm leading-8 text-muted">
        {order.customerName} عزیز، سفارش شما ذخیره شد. برای هماهنگی ارسال با شماره {order.phone} تماس می‌گیریم.
        پرداخت هنگام تحویل است.
      </p>
      <ul className="mt-8 divide-y divide-line border border-line">
        {order.items.map((item) => (
          <li key={`${item.productName}-${item.unitPrice}`} className="flex justify-between gap-3 px-4 py-3 text-sm">
            <span>
              {item.productName}
              <span className="text-muted">
                {" "}
                × {formatNumber(item.quantity)} {item.unit}
              </span>
            </span>
            <span>{formatPrice(item.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        جمع: <span className="font-medium">{formatPrice(order.total)}</span>
      </p>
      <p className="mt-2 text-sm text-muted">آدرس: {order.address}</p>
      <Link href="/" className={`${btnGhost} mt-8`}>
        بازگشت به خانه
      </Link>
    </div>
  );
}
