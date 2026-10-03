"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { fieldClass } from "@/lib/shop";

export function ProductSearch({ initial }: { initial: string }) {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <form
      className="flex w-full gap-2 md:w-auto"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const q = String(data.get("q") ?? "").trim();
        const next = new URLSearchParams(params.toString());
        if (q) next.set("q", q);
        else next.delete("q");
        const query = next.toString();
        router.push(query ? `/products?${query}` : "/products");
      }}
    >
      <input
        name="q"
        defaultValue={initial}
        placeholder="جستجوی نام شکلات"
        className={`${fieldClass} md:w-64`}
        aria-label="جستجو"
      />
      <button type="submit" className="border border-cocoa px-4 text-sm text-cocoa hover:bg-cocoa hover:text-white">
        جستجو
      </button>
    </form>
  );
}
