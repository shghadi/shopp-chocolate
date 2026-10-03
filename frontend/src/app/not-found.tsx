import Link from "next/link";
import { btnPrimary } from "@/lib/shop";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold text-cocoa">صفحه پیدا نشد</h1>
      <p className="mt-3 text-sm leading-8 text-muted">این نشانی در فروشگاه نیست.</p>
      <Link href="/products" className={`${btnPrimary} mt-6`}>
        رفتن به محصولات
      </Link>
    </div>
  );
}
