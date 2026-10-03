import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailPurchase } from "@/components/DetailPurchase";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductImage } from "@/components/ProductImage";
import { formatPrice } from "@/lib/format";
import { getProduct, getProducts } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug).catch(() => null);
  return { title: product?.name ?? "محصول" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug).catch(() => null);
  if (!product) notFound();

  const related = (await getProducts({ category: product.categorySlug }).catch(() => []))
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-gold">
              خانه
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/products" className="hover:text-gold">
              محصولات
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={`/products?category=${product.categorySlug}`} className="hover:text-gold">
              {product.categoryName}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="grid items-start gap-10 md:grid-cols-2">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          slug={product.slug}
          category={product.categorySlug}
          className="aspect-square border border-line"
        />
        <div>
          <p className="text-sm text-olive">{product.categoryName}</p>
          <h1 className="mt-2 text-3xl font-semibold text-cocoa">{product.name}</h1>
          <p className="mt-4 text-lg">
            {formatPrice(product.price)}
            <span className="text-sm text-muted"> / {product.unit}</span>
          </p>
          <p className="mt-2 text-sm text-muted">{product.weightLabel}</p>
          <p className="mt-6 text-sm leading-8">{product.description}</p>
          <DetailPurchase product={product} />
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-semibold text-cocoa">از همین دسته</h2>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </div>
  );
}
