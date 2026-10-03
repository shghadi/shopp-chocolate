"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAdminSession } from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/adminApi";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { orderStatuses, statusClass, statusLabel } from "@/lib/orderStatus";
import type { AdminOrder } from "@/lib/types";

export function OrderDetailPanel({ id }: { id: string }) {
  const { token } = useAdminSession();
  const orderId = Number(id);
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!token || !Number.isInteger(orderId)) return;
    let cancelled = false;
    adminApi
      .order(token, orderId)
      .then((item) => {
        if (!cancelled) setOrder(item);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "سفارش خوانده نشد.");
      });
    return () => {
      cancelled = true;
    };
  }, [token, orderId]);

  async function changeStatus(status: string) {
    if (!token || !order || status === order.status) return;
    if (status === "cancelled" && !window.confirm("سفارش لغو شود؟ تعداد کالا به موجودی برمی‌گردد.")) return;
    setPending(true);
    setError("");
    try {
      const updated = await adminApi.updateStatus(token, order.id, status);
      setOrder(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "وضعیت عوض نشد.");
    } finally {
      setPending(false);
    }
  }

  if (!Number.isInteger(orderId)) return <p className="text-sm">شماره سفارش درست نیست.</p>;
  if (error && !order) return <p className="text-sm text-red-800">{error}</p>;
  if (!order) return <p className="text-sm text-muted">در حال خواندن سفارش...</p>;

  return (
    <div>
      <Link href="/admin/orders" className="text-sm text-olive hover:text-cocoa">
        بازگشت به سفارش‌ها
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-cocoa">سفارش {formatNumber(order.id)}</h1>
        <span className={`border px-2 py-1 text-sm ${statusClass(order.status)}`}>{statusLabel(order.status)}</span>
      </div>
      <p className="mt-2 text-sm text-muted">{formatDate(order.createdAt)}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Info label="خریدار" value={order.customerName} />
        <Info label="موبایل" value={order.phone} ltr />
        <Info label="جمع" value={formatPrice(order.total)} />
      </div>
      <div className="mt-4 border border-line bg-white p-4">
        <p className="text-xs text-muted">آدرس تحویل</p>
        <p className="mt-2 text-sm leading-7">{order.address}</p>
        {order.note ? <p className="mt-3 text-sm leading-7 text-muted">توضیح: {order.note}</p> : null}
      </div>

      <h2 className="mt-8 text-lg font-semibold">اقلام</h2>
      <ul className="mt-3 divide-y divide-line border border-line bg-white">
        {order.items.map((item) => (
          <li key={`${item.productId}-${item.productName}`} className="flex justify-between gap-3 px-4 py-3 text-sm">
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

      <h2 className="mt-8 text-lg font-semibold">وضعیت</h2>
      <p className="mt-2 text-sm leading-7 text-muted">
        لغو کردن، موجودی را برمی‌گرداند. اگر سفارش لغوشده را دوباره باز کنید، موجودی دوباره کم می‌شود.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {orderStatuses.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={pending || item.id === order.status}
            onClick={() => changeStatus(item.id)}
            className={`border px-3 py-2 text-sm disabled:opacity-70 ${item.id === order.status ? statusClass(item.id) : "border-line bg-white hover:border-gold"}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {error ? <p className="mt-3 text-sm text-red-800">{error}</p> : null}
    </div>
  );
}

function Info({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="border border-line bg-white p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-2 text-sm" dir={ltr ? "ltr" : undefined}>
        {value}
      </p>
    </div>
  );
}
