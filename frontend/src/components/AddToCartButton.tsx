"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { add, lines } = useCart();
  const [done, setDone] = useState(false);
  const inCart = lines.find((line) => line.productId === product.id)?.quantity ?? 0;
  const full = product.stock <= inCart;

  return (
    <button
      type="button"
      disabled={full}
      onClick={() => {
        add({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          unit: product.unit,
          imageUrl: product.imageUrl,
          stock: product.stock,
        });
        setDone(true);
        window.setTimeout(() => setDone(false), 1200);
      }}
      className="border border-cocoa px-3 py-1.5 text-sm text-cocoa transition hover:bg-cocoa hover:text-white disabled:cursor-not-allowed disabled:border-line disabled:text-muted disabled:hover:bg-transparent"
    >
      {product.stock === 0 ? "ناموجود" : full ? "در سبد" : done ? "اضافه شد" : "افزودن"}
    </button>
  );
}
