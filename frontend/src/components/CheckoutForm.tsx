"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { createOrder } from "@/lib/api";
import { formatNumber, formatPrice } from "@/lib/format";
import { btnPrimary, fieldClass, labelClass } from "@/lib/shop";

export function CheckoutForm() {
  const { lines, total, ready } = useCart();
  const router = useRouter();
  const submitted = useRef(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!ready || submitted.current) return;
    if (lines.length === 0) router.replace("/cart");
  }, [ready, lines.length, router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    setPending(true);
    try {
      const order = await createOrder({
        customerName: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        address: String(data.get("address") ?? ""),
        note: String(data.get("note") ?? ""),
        items: lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
      });
      submitted.current = true;
      window.sessionStorage.setItem("zarrin-last-order", JSON.stringify(order));
      router.push("/checkout/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ثبت سفارش انجام نشد.");
    } finally {
      setPending(false);
    }
  }

  if (!ready || lines.length === 0) {
    return <p className="py-10 text-sm text-muted">در حال آماده‌سازی سفارش...</p>;
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-4">
        <label className="block">
          <span className={labelClass}>نام و نام خانوادگی</span>
          <input name="name" required autoComplete="name" className={fieldClass} />
        </label>
        <label className="block">
          <span className={labelClass}>موبایل</span>
          <input name="phone" required autoComplete="tel" inputMode="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹" className={fieldClass} />
        </label>
        <label className="block">
          <span className={labelClass}>آدرس</span>
          <textarea name="address" required rows={4} autoComplete="street-address" className={fieldClass} />
        </label>
        <label className="block">
          <span className={labelClass}>توضیح سفارش</span>
          <textarea name="note" rows={3} className={fieldClass} placeholder="مثلاً زمان تحویل یا متن روی کارت هدیه" />
        </label>
        {error ? <p className="text-sm text-red-800">{error}</p> : null}
        <button type="submit" className={btnPrimary} disabled={pending}>
          {pending ? "در حال ثبت..." : "ثبت نهایی سفارش"}
        </button>
      </div>
      <aside className="h-fit border border-line bg-cream p-5">
        <h2 className="font-semibold">خلاصه</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map((line) => (
            <li key={line.productId} className="flex justify-between gap-3">
              <span>
                {line.name}
                <span className="text-muted"> × {formatNumber(line.quantity)}</span>
              </span>
              <span>{formatPrice(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-line pt-4 text-sm font-medium">
          <span>جمع</span>
          <span>{formatPrice(total)}</span>
        </p>
      </aside>
    </form>
  );
}
