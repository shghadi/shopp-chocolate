import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex h-full flex-col border border-line bg-white p-4 transition hover:border-gold">
      <Link href={`/products/${product.slug}`} className="block" aria-label={product.name}>
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          slug={product.slug}
          category={product.categorySlug}
          className="aspect-square"
        />
      </Link>
      <div className="mt-4 flex flex-1 flex-col text-center">
        <p className="text-xs text-olive">{product.categoryName}</p>
        <h3 className="mt-1 line-clamp-2 min-h-12 text-base font-medium">
          <Link href={`/products/${product.slug}`} className="hover:text-gold">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-cocoa">
          {formatPrice(product.price)}
          <span className="text-muted"> / {product.unit}</span>
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <Link href={`/products/${product.slug}`} className="text-sm text-olive hover:text-cocoa">
            توضیحات
          </Link>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
