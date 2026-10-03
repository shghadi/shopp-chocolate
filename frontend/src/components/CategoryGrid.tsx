import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { formatNumber } from "@/lib/format";
import type { Category } from "@/lib/types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/products?category=${category.slug}`}
          className="group relative block overflow-hidden border border-line"
        >
          <ProductImage
            src={category.imageUrl}
            alt=""
            slug={category.slug}
            category={category.slug === "occasion" ? "occasion" : category.slug}
            className="h-52 transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa-deep/85 via-cocoa-deep/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <h3 className="text-lg font-medium">{category.name}</h3>
            <p className="mt-1 text-xs text-white/80">{formatNumber(category.productCount)} محصول</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
