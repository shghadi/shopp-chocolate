import type { Category, OrderResult, Product } from "@/lib/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("request failed");
  }
  return (await response.json()) as T;
}

export function getCategories() {
  return getJson<Category[]>("/api/categories");
}

export function getProducts(params?: { category?: string; q?: string; featured?: boolean }) {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.q) search.set("q", params.q);
  if (params?.featured) search.set("featured", "true");
  const query = search.toString();
  return getJson<Product[]>(`/api/products${query ? `?${query}` : ""}`);
}

export async function getProduct(slug: string) {
  const response = await fetch(`${API_URL}/api/products/${slug}`, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("request failed");
  return (await response.json()) as Product;
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("ارتباط با سرور برقرار نشد. بک‌اند را اجرا کنید.");
  }

  const data = (await response.json().catch(() => ({}))) as { message?: string };
  if (!response.ok) {
    throw new Error(data.message ?? "درخواست انجام نشد.");
  }
  return data as T;
}

export function createOrder(body: {
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  items: { productId: number; quantity: number }[];
}) {
  return postJson<OrderResult>("/api/orders", body);
}
