import type { Metadata } from "next";
import Link from "next/link";
import { Ornament } from "@/components/SectionHeading";
import { btnPrimary } from "@/lib/shop";

export const metadata: Metadata = { title: "درباره ما" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <p className="text-xs tracking-[0.28em] text-gold">ZARRIN</p>
      <h1 className="mt-3 text-3xl font-semibold text-cocoa">شکلات‌خانه زرین</h1>
      <Ornament />
      <div className="space-y-5 text-sm leading-8">
        <p>
          زرین یک فروشگاه ساده شکلات است: جعبه هدیه برای کسی که می‌خواهد چیزی مرتب هدیه بدهد، و محصول فله برای کسی که کیلویی می‌خرد.
        </p>
        <p>
          دسته‌ها را از هم جدا کرده‌ایم تا بین کادو، فله، تخته روزانه و بسته مناسبتی سردرگم نشوید. قیمت هر محصول کنار همان واحد فروش نوشته شده؛ جعبه، عدد، یا کیلوگرم.
        </p>
        <p>
          سفارش در سایت ثبت می‌شود و هماهنگی ارسال تلفنی است. درگاه پرداخت در این نسخه نیست تا خرید پیچیده نشود.
        </p>
      </div>
      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {["طعم مشخص", "بسته هدیه", "فروش وزنی"].map((item) => (
          <li key={item} className="border border-line bg-cream px-4 py-5 text-center text-sm">
            {item}
          </li>
        ))}
      </ul>
      <Link href="/products" className={`${btnPrimary} mt-8`}>
        دیدن محصولات
      </Link>
    </div>
  );
}
