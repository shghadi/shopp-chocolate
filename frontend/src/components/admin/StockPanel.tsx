"use client";

import { useEffect, useState } from "react";
import { useAdminSession } from "@/components/admin/AdminShell";
import { adminApi } from "@/lib/adminApi";
import { formatPrice } from "@/lib/format";
import type { AdminProduct } from "@/lib/types";

const lowStockAt = 5;

export function StockPanel() {
  const { token } = useAdminSession();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    adminApi
      .products(token)
      .then((items) => {
        if (!cancelled) setProducts(items);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "موجودی خوانده نشد.");
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function save(product: AdminProduct) {
    if (!token) return;
    const raw = drafts[product.id] ?? String(product.stock);
    const stock = Number(raw);
    if (!Number.isInteger(stock) || stock < 0 || stock > 100000) {
      setError("موجودی باید عدد درست بین ۰ و ۱۰۰۰۰۰ باشد.");
      return;
    }
    setError("");
    setMessage("");
    setPendingId(product.id);
    try {
      const updated = await adminApi.updateStock(token, product.id, stock);
      setProducts((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setDrafts((current) => {
        const next = { ...current };
        delete next[product.id];
        return next;
      });
      setMessage(`موجودی «${updated.name}» ذخیره شد.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ذخیره موجودی انجام نشد.");
    } finally {
      setPendingId(null);
    }
  }

  if (error && products.length === 0) return <p className="text-sm text-red-800">{error}</p>;
  if (products.length === 0 && !error) return <p className="text-sm text-muted">در حال خواندن موجودی...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-cocoa">موجودی محصولات</h1>
      <p className="mt-2 text-sm leading-7 text-muted">عدد را عوض کنید و ذخیره را بزنید. اگر موجودی ۵ یا کمتر باشد، ردیف مشخص می‌شود.</p>
      {message ? <p className="mt-4 text-sm text-olive">{message}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-800">{error}</p> : null}
      <div className="mt-6 overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-cream text-right">
            <tr>
              <th className="px-3 py-3 font-medium">محصول</th>
              <th className="px-3 py-3 font-medium">دسته</th>
              <th className="px-3 py-3 font-medium">واحد</th>
              <th className="px-3 py-3 font-medium">قیمت</th>
              <th className="px-3 py-3 font-medium">موجودی</th>
              <th className="px-3 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const value = drafts[product.id] ?? String(product.stock);
              const low = product.stock <= lowStockAt;
              return (
                <tr key={product.id} className="border-t border-line">
                  <td className="px-3 py-3">
                    {product.name}
                    {low ? <span className="mr-2 border border-gold px-1.5 py-0.5 text-xs text-cocoa">کم</span> : null}
                  </td>
                  <td className="px-3 py-3 text-muted">{product.categoryName}</td>
                  <td className="px-3 py-3">{product.unit}</td>
                  <td className="px-3 py-3">{formatPrice(product.price)}</td>
                  <td className="px-3 py-3">
                    <input
                      inputMode="numeric"
                      value={value}
                      onChange={(event) => setDrafts((current) => ({ ...current, [product.id]: event.target.value }))}
                      className="w-24 border border-line px-2 py-1.5 outline-none focus:border-gold"
                      aria-label={`موجودی ${product.name}`}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => save(product)}
                      disabled={pendingId === product.id}
                      className="border border-cocoa px-3 py-1.5 hover:bg-cocoa hover:text-white disabled:opacity-50"
                    >
                      {pendingId === product.id ? "..." : "ذخیره"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">موجودی همان واحد فروش محصول است: جعبه، عدد یا کیلوگرم.</p>
    </div>
  );
}
