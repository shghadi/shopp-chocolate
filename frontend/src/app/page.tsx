import Link from "next/link";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductArt } from "@/components/ProductArt";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";
import { getCategories, getProducts } from "@/lib/api";
import { btnPrimary } from "@/lib/shop";
import type { Category, Product } from "@/lib/types";

export default async function HomePage() {
  let categories: Category[] = [];
  let featured: Product[] = [];
  let offline = false;

  try {
    [categories, featured] = await Promise.all([getCategories(), getProducts({ featured: true })]);
  } catch {
    offline = true;
  }

  return (
    <>
      <section className="bg-cocoa-deep text-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs tracking-[0.35em] text-gold-soft">ZARRIN CHOCOLATE</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.45] md:text-5xl">
              شکلات کادویی،
              <br />
              و شکلات فله
            </h1>
            <p className="mt-5 max-w-md text-sm leading-8 text-cream/80">
              جعبه‌های هدیه برای مراسم، و محصولات وزنی برای قنادی و پذیرایی. دسته، وزن و قیمت هر کدام جدا نوشته شده است.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products?category=gift" className="bg-gold px-5 py-3 text-sm text-cocoa-deep">
                جعبه‌های کادویی
              </Link>
              <Link href="/products?category=bulk" className="border border-gold-soft px-5 py-3 text-sm text-cream">
                محصولات فله
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute -top-3 -left-3 h-full w-full border border-gold/50" />
            <ProductArt slug="hero-ruby" category="gift" className="relative h-[420px] w-full bg-cream" />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-cream">
        <ul className="mx-auto grid max-w-6xl gap-4 px-4 py-8 text-sm sm:grid-cols-3">
          <li className="border border-line bg-white px-4 py-4">بسته‌بندی آماده هدیه</li>
          <li className="border border-line bg-white px-4 py-4">فروش فله، به‌ازای هر کیلوگرم</li>
          <li className="border border-line bg-white px-4 py-4">ثبت سفارش و هماهنگی تلفنی</li>
        </ul>
      </section>

      {offline ? (
        <p className="mx-auto max-w-6xl px-4 py-16 text-sm leading-8">
          فهرست محصولات از سرور خوانده نشد. بک‌اند را روی نشانی localhost:5080 اجرا کنید.
        </p>
      ) : (
        <>
          <section className="mx-auto max-w-6xl px-4 py-16">
            <SectionHeading
              title="خرید بر اساس دسته"
              subtitle="هدیه و کادو را از فله، تخته‌ای و بسته‌های مناسبتی جدا ببینید."
            />
            <CategoryGrid categories={categories} />
          </section>
          <section className="bg-cream py-16">
            <div className="mx-auto max-w-6xl px-4">
              <SectionHeading title="برگزیده‌ها" subtitle="چند محصول برای شروع، از جعبه هدیه تا خرید وزنی." />
              <ProductGrid products={featured} />
              <div className="mt-10 text-center">
                <Link href="/products" className={btnPrimary}>
                  همه محصولات
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      <section className="bg-cocoa text-cream">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">برای قنادی و پذیرایی</h2>
            <p className="mt-3 max-w-xl text-sm leading-8 text-cream/80">
              شکلات تلخ، شیری، دراژه و مغز روکش‌دار را کیلویی سفارش دهید. قیمت هر کیلوگرم کنار محصول نوشته شده است.
            </p>
          </div>
          <Link href="/products?category=bulk" className="border border-gold px-5 py-3 text-sm text-gold-soft">
            مشاهده فله
          </Link>
        </div>
      </section>
    </>
  );
}
