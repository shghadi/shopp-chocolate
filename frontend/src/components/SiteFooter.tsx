import Link from "next/link";
import { getCategories } from "@/lib/api";
import { shop } from "@/lib/shop";
import type { Category } from "@/lib/types";

export async function SiteFooter() {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  return (
    <footer className="bg-cocoa-deep text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <p className="text-xs tracking-[0.28em] text-gold-soft">{shop.en}</p>
          <p className="mt-2 text-xl font-semibold">{shop.name}</p>
          <p className="mt-4 text-sm leading-8 text-cream/75">
            فروشگاه شکلات برای هدیه، مراسم و خرید فله. هر محصول دسته، وزن و قیمت مشخص دارد.
          </p>
        </div>
        <div>
          <p className="text-sm text-gold-soft">دسته‌ها</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/products" className="hover:text-gold-soft">
                همه محصولات
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/products?category=${category.slug}`} className="hover:text-gold-soft">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm text-gold-soft">تماس</p>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-cream/80">
            <li>{shop.address}</li>
            <li>
              <a href={shop.phoneHref}>{shop.phone}</a>
            </li>
            <li>
              <a href={`mailto:${shop.email}`}>{shop.email}</a>
            </li>
            <li>{shop.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-cream/60">
        ۱۴۰۵ {shop.name}
      </div>
    </footer>
  );
}
