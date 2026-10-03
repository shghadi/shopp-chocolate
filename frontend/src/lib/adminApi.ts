import type { AdminCustomer, AdminOrder, AdminProduct, AdminSummary } from "@/lib/types";

export const ADMIN_TOKEN_KEY = "zarrin-admin-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080";

export async function adminRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new Error("ارتباط با سرور برقرار نشد. بک‌اند را اجرا کنید.");
  }

  if (response.status === 204) return undefined as T;

  const data = (await response.json().catch(() => ({}))) as { message?: string };
  if (response.status === 401) {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    window.dispatchEvent(new Event("zarrin-admin-unauthorized"));
    throw new Error(data.message ?? "نشست پنل تمام شد. دوباره وارد شوید.");
  }
  if (!response.ok) {
    throw new Error(data.message ?? "درخواست انجام نشد.");
  }
  return data as T;
}

export async function adminLogin(username: string, password: string) {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    throw new Error("ارتباط با سرور برقرار نشد. بک‌اند را اجرا کنید.");
  }

  const data = (await response.json().catch(() => ({}))) as { message?: string; token?: string; username?: string };
  if (!response.ok || !data.token) {
    throw new Error(data.message ?? "ورود انجام نشد.");
  }
  return { token: data.token, username: data.username ?? username };
}

export const adminApi = {
  summary: (token: string) => adminRequest<AdminSummary>("/api/admin/summary", token),
  products: (token: string) => adminRequest<AdminProduct[]>("/api/admin/products", token),
  updateStock: (token: string, id: number, stock: number) =>
    adminRequest<AdminProduct>(`/api/admin/products/${id}/stock`, token, {
      method: "PATCH",
      body: JSON.stringify({ stock }),
    }),
  orders: (token: string, params?: { status?: string; q?: string }) => {
    const search = new URLSearchParams();
    if (params?.status) search.set("status", params.status);
    if (params?.q) search.set("q", params.q);
    const query = search.toString();
    return adminRequest<AdminOrder[]>(`/api/admin/orders${query ? `?${query}` : ""}`, token);
  },
  order: (token: string, id: number) => adminRequest<AdminOrder>(`/api/admin/orders/${id}`, token),
  updateStatus: (token: string, id: number, status: string) =>
    adminRequest<AdminOrder>(`/api/admin/orders/${id}/status`, token, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  customers: (token: string) => adminRequest<AdminCustomer[]>("/api/admin/customers", token),
};
