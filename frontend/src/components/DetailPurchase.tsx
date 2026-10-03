"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { formatNumber } from "@/lib/format";
import { btnPrimary } from "@/lib/shop";
import type { Product } from "@/lib/types";

export function DetailPurchase({ product }: { product: Product }) {
  const { add, lines } = useCart();
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const inCart = lines.find((line) => line.productId === product.id)?.quantity ?? 0;
  const room = Math.max(product.stock - inCart, 0);
  const max = Math.max(Math.min(room, 50), 0);

  if (product.stock === 0) {
    return <p className="text-sm text-muted">این محصول فعلاً ناموجود است.</p>;
  }

  return (
    <div className="mt-8">
      <p className="text-sm text-muted">
        {room === 0
          ? "حداکثر موجودی همین حالا در سبد شماست."
          : product.stock <= 10
            ? `تنها ${formatNumber(product.stock)} ${product.unit} در انبار مانده`
            : "موجود در انبار"}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center border border-line">
          <button
            type="button"
            className="px-3 py-2 text-lg"
            onClick={() => setQty((value) => Math.max(1, value - 1))}
            aria-label="کم کردن"
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm">{formatNumber(qty)}</span>
          <button
            type="button"
            className="px-3 py-2 text-lg disabled:text-muted"
            disabled={qty >= Math.max(max, 1)}
            onClick={() => setQty((value) => Math.min(max, value + 1))}
            aria-label="زیاد کردن"
          >
            +
          </button>
        </div>
        <button
          type="button"
          className={btnPrimary}
          disabled={room === 0}
          onClick={() => {
            add(
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                unit: product.unit,
                imageUrl: product.imageUrl,
                stock: product.stock,
              },
              qty,
            );
            setDone(true);
          }}
        >
          {done ? "به سبد اضافه شد" : "افزودن به سبد"}
        </button>
      </div>
    </div>
  );
}
