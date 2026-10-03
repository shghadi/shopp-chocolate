import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "ثبت سفارش" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-cocoa">ثبت سفارش</h1>
      <p className="mt-3 max-w-2xl text-sm leading-8 text-muted">
        بعد از ثبت، سفارش در سیستم می‌ماند و برای هماهنگی ارسال با شما تماس گرفته می‌شود.
      </p>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
