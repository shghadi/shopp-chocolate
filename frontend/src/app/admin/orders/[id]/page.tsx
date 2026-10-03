import type { Metadata } from "next";
import { OrderDetailPanel } from "@/components/admin/OrderDetailPanel";

export const metadata: Metadata = { title: "جزئیات سفارش" };

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailPanel id={id} />;
}
