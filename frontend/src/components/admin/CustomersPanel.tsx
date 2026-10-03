"use client";

import { useEffect, useState } from "react";
import { useAdminSession } from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/adminApi";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import type { AdminCustomer } from "@/lib/types";

export function CustomersPanel() {
  const { token } = useAdminSession();
  const [customers, setCustomers] = useState<AdminCustomer[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    adminApi
      .customers(token)
      .then((items) => {
        if (!cancelled) setCustomers(items);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "خریداران خوانده نشدند.");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (error) return <p className="text-sm text-red-800">{error}</p>;
  if (!customers) return <p className="text-sm text-muted">در حال خواندن خریداران...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-cocoa">خریداران</h1>
      <p className="mt-2 text-sm leading-7 text-muted">
        خریدار حساب جدا ندارد. هر کسی که سفارش داده با نام، موبایل و آخرین آدرس اینجا دیده می‌شود. سفارش لغوشده در مبلغ خرید حساب نمی‌شود.
      </p>
      {customers.length === 0 ? (
        <p className="mt-6 text-sm text-muted">هنوز خریدی ثبت نشده است.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-line bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-cream text-right">
              <tr>
                <th className="px-3 py-3 font-medium">نام</th>
                <th className="px-3 py-3 font-medium">موبایل</th>
                <th className="px-3 py-3 font-medium">آخرین آدرس</th>
                <th className="px-3 py-3 font-medium">تعداد سفارش</th>
                <th className="px-3 py-3 font-medium">مبلغ خرید</th>
                <th className="px-3 py-3 font-medium">آخرین خرید</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.phone} className="border-t border-line">
                  <td className="px-3 py-3">{customer.name}</td>
                  <td className="px-3 py-3" dir="ltr">
                    {customer.phone}
                  </td>
                  <td className="max-w-xs px-3 py-3 text-muted">{customer.address}</td>
                  <td className="px-3 py-3">{formatNumber(customer.orderCount)}</td>
                  <td className="px-3 py-3">{formatPrice(customer.totalSpent)}</td>
                  <td className="px-3 py-3 text-muted">{formatDate(customer.lastOrderAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
