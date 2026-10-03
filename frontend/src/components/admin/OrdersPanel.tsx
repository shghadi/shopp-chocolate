"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useAdminSession } from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/adminApi";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { orderStatuses, statusClass, statusLabel } from "@/lib/orderStatus";
import { fieldClass } from "@/lib/shop";
import type { AdminOrder } from "@/lib/types";

export function OrdersPanel() {
  const { token } = useAdminSession();
  const params = useSearchParams();
  const router = useRouter();
  const status = params.get("status") ?? "";
  const q = params.get("q") ?? "";
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setOrders(null);
    adminApi
      .orders(token, { status: status || undefined, q: q || undefined })
      .then((items) => {
        if (!cancelled) setOrders(items);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "سفارش‌ها خوانده نشد.");
      });
    return () => {
      cancelled = true;
    };
  }, [token, status, q]);

  function openFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = new URLSearchParams();
    const nextStatus = String(data.get("status") ?? "");
    const nextQuery = String(data.get("q") ?? "").trim();
    if (nextStatus) next.set("status", nextStatus);
    if (nextQuery) next.set("q", nextQuery);
    const query = next.toString();
    router.push(query ? `/admin/orders?${query}` : "/admin/orders");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-cocoa">سفارش‌ها</h1>
      <p className="mt-2 text-sm leading-7 text-muted">نام، موبایل، آدرس و وضعیت هر خرید اینجاست.</p>
      <form key={`${status}-${q}`} onSubmit={openFilter} className="mt-6 flex flex-col gap-3 md:flex-row">
        <select name="status" defaultValue={status} className={`${fieldClass} md:w-48`}>
          <option value="">همه وضعیت‌ها</option>
          {orderStatuses.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        <input name="q" defaultValue={q} placeholder="نام، موبایل یا آدرس" className={fieldClass} />
        <button type="submit" className="border border-cocoa px-4 py-2 text-sm hover:bg-cocoa hover:text-white">
          اعمال
        </button>
      </form>
      {error ? <p className="mt-4 text-sm text-red-800">{error}</p> : null}
      {orders === null && !error ? <p className="mt-6 text-sm text-muted">در حال خواندن سفارش‌ها...</p> : null}
      {orders && orders.length === 0 ? <p className="mt-6 text-sm text-muted">سفارشی با این فیلتر نیست.</p> : null}
      {orders && orders.length > 0 ? (
        <div className="mt-6 overflow-x-auto border border-line bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-cream text-right">
              <tr>
                <th className="px-3 py-3 font-medium">شماره</th>
                <th className="px-3 py-3 font-medium">خریدار</th>
                <th className="px-3 py-3 font-medium">آدرس</th>
                <th className="px-3 py-3 font-medium">جمع</th>
                <th className="px-3 py-3 font-medium">وضعیت</th>
                <th className="px-3 py-3 font-medium">زمان</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-line">
                  <td className="px-3 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-cocoa hover:text-gold">
                      {formatNumber(order.id)}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <p>{order.customerName}</p>
                    <p className="text-xs text-muted" dir="ltr">
                      {order.phone}
                    </p>
                  </td>
                  <td className="max-w-xs px-3 py-3 text-muted">{order.address}</td>
                  <td className="px-3 py-3">{formatPrice(order.total)}</td>
                  <td className="px-3 py-3">
                    <span className={`border px-2 py-0.5 text-xs ${statusClass(order.status)}`}>{statusLabel(order.status)}</span>
                  </td>
                  <td className="px-3 py-3 text-muted">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
