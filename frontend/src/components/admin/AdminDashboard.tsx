"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAdminSession } from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/adminApi";
import { formatNumber } from "@/lib/format";
import { statusClass, statusLabel } from "@/lib/orderStatus";
import type { AdminOrder, AdminSummary } from "@/lib/types";

export function AdminDashboard() {
  const { token } = useAdminSession();
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    Promise.all([adminApi.summary(token), adminApi.orders(token)])
      .then(([nextSummary, nextOrders]) => {
        if (cancelled) return;
        setSummary(nextSummary);
        setOrders(nextOrders.slice(0, 5));
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "خواندن پنل انجام نشد.");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (error) return <p className="text-sm text-red-800">{error}</p>;
  if (!summary) return <p className="text-sm text-muted">در حال خواندن خلاصه...</p>;

  const cards = [
    { label: "ثبت شده", value: summary.newOrders, href: "/admin/orders?status=new" },
    { label: "تایید شده", value: summary.confirmedOrders, href: "/admin/orders?status=confirmed" },
    { label: "ارسال شده", value: summary.shippedOrders, href: "/admin/orders?status=shipped" },
    { label: "تحویل شده", value: summary.deliveredOrders, href: "/admin/orders?status=delivered" },
    { label: "لغو شده", value: summary.cancelledOrders, href: "/admin/orders?status=cancelled" },
    { label: "موجودی کم", value: summary.lowStock, href: "/admin/stock" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-cocoa">خلاصه فروش</h1>
      <p className="mt-2 text-sm text-muted">{formatNumber(summary.productCount)} محصول در فهرست است.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="border border-line bg-white px-4 py-4 hover:border-gold">
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-cocoa">{formatNumber(card.value)}</p>
          </Link>
        ))}
      </div>
      <h2 className="mt-10 text-lg font-semibold text-cocoa">آخرین سفارش‌ها</h2>
      {orders.length === 0 ? (
        <p className="mt-3 text-sm text-muted">هنوز سفارشی ثبت نشده است.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line border border-line bg-white">
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`/admin/orders/${order.id}`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-cream">
                <span>
                  شماره {formatNumber(order.id)} · {order.customerName}
                </span>
                <span className={`border px-2 py-0.5 text-xs ${statusClass(order.status)}`}>{statusLabel(order.status)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
