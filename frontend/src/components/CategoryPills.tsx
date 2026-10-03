import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryPills({
  categories,
  active,
  q,
}: {
  categories: Category[];
  active?: string;
  q?: string;
}) {
  const hrefFor = (slug?: string) => {
    const search = new URLSearchParams();
    if (slug) search.set("category", slug);
    if (q) search.set("q", q);
    const query = search.toString();
    return query ? `/products?${query}` : "/products";
  };

  const className = (on: boolean) =>
    on
      ? "border-cocoa bg-cocoa px-3 py-1.5 text-sm text-white"
      : "border border-line bg-white px-3 py-1.5 text-sm hover:border-gold";

  return (
    <div className="flex flex-wrap gap-2">
      <Link href={hrefFor()} className={className(!active)}>
        همه
      </Link>
      {categories.map((category) => (
        <Link key={category.slug} href={hrefFor(category.slug)} className={className(active === category.slug)}>
          {category.name}
        </Link>
      ))}
    </div>
  );
}
