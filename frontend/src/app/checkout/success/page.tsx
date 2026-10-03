import type { Metadata } from "next";
import { OrderSuccess } from "@/components/OrderSuccess";

export const metadata: Metadata = { title: "سفارش ثبت شد" };

export default function SuccessPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <OrderSuccess />
    </div>
  );
}
