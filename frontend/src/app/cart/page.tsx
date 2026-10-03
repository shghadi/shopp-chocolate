import type { Metadata } from "next";
import { CartView } from "@/components/CartView";
import { Ornament } from "@/components/SectionHeading";

export const metadata: Metadata = { title: "سبد خرید" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-center text-3xl font-semibold text-cocoa">سبد خرید</h1>
      <Ornament />
      <CartView />
    </div>
  );
}
