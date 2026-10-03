import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryPills } from "@/components/CategoryPills";
import { Ornament } from "@/components/SectionHeading";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductSearch } from "@/components/ProductSearch";
import { getCategories, getProducts } from "@/lib/api";

export const metadata: Metadata = { title: "محصولات" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  let loadError = false;
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  let products: Awaited<ReturnType<typeof getProducts>> = [];

  try {
    categories = await getCategories();
    const active = categories.find((item) => item.slug === category);
    products = await getProducts({
      category: active ? active.slug : undefined,
      q: q?.trim() || undefined,
    });
    const title = active?.name ?? "محصولات";
    const description =
      active?.description ?? "جعبه‌های کادویی، شکلات فله، تخته‌ای و بسته‌های مناسبتی.";

    return (
      <>
        <div className="border-b border-line bg-cream">
          <div className="mx-auto max-w-6xl px-4 py-12 text-center">
            <h1 className="text-3xl font-semibold text-cocoa md:text-4xl">{title}</h1>
            <Ornament />
            <p className="mx-auto max-w-2xl text-sm leading-8 text-muted">{description}</p>
            {category && !active ? <p className="mt-3 text-sm">این دسته پیدا نشد. همه محصولات نشان داده می‌شود.</p> : null}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CategoryPills categories={categories} active={active?.slug} q={q} />
            <Suspense fallback={null}>
              <ProductSearch initial={q ?? ""} />
            </Suspense>
          </div>
          <div className="mt-8">
            {products.length === 0 ? (
              <p className="border border-line bg-cream px-4 py-8 text-center text-sm">در این فهرست محصولی نیست.</p>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </div>
      </>
    );
  } catch {
    loadError = true;
  }

  return loadError ? (
    <p className="mx-auto max-w-6xl px-4 py-20 text-center text-sm leading-8">
      ارتباط با سرور برقرار نشد. بک‌اند را روی پورت ۵۰۸۰ اجرا کنید.
    </p>
  ) : null;
}
