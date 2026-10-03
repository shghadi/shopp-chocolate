import type { Metadata } from "next";
import { Suspense } from "react";
import { OrdersPanel } from "@/components/admin/OrdersPanel";

export const metadata: Metadata = { title: "سفارش‌ها" };

export default function OrdersPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">در حال خواندن سفارش‌ها...</p>}>
      <OrdersPanel />
    </Suspense>
  );
}
