"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { ADMIN_TOKEN_KEY } from "@/lib/adminApi";
import { shop } from "@/lib/shop";

type AdminSession = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AdminSessionContext = createContext<AdminSession | null>(null);

const links = [
  { href: "/admin", label: "خلاصه" },
  { href: "/admin/stock", label: "موجودی" },
  { href: "/admin/orders", label: "سفارش‌ها" },
  { href: "/admin/customers", label: "خریداران" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    setToken(window.localStorage.getItem(ADMIN_TOKEN_KEY));
    setReady(true);
    const onLost = () => setToken(null);
    window.addEventListener("zarrin-admin-unauthorized", onLost);
    return () => window.removeEventListener("zarrin-admin-unauthorized", onLost);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!token && !isLogin) router.replace("/admin/login");
    if (token && isLogin) router.replace("/admin");
  }, [ready, token, isLogin, router]);

  function login(nextToken: string) {
    window.localStorage.setItem(ADMIN_TOKEN_KEY, nextToken);
    setToken(nextToken);
    router.push("/admin");
  }

  function logout() {
    window.localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
    router.replace("/admin/login");
  }

  if (!ready) {
    return <p className="p-10 text-sm text-muted">در حال باز کردن پنل...</p>;
  }

  if (isLogin) {
    return <AdminSessionContext.Provider value={{ token, login, logout }}>{children}</AdminSessionContext.Provider>;
  }

  if (!token) {
    return <p className="p-10 text-sm text-muted">در حال انتقال به ورود...</p>;
  }

  return (
    <AdminSessionContext.Provider value={{ token, login, logout }}>
      <div className="min-h-screen bg-cream md:grid md:grid-cols-[220px_1fr]">
        <aside className="bg-cocoa-deep text-cream">
          <div className="px-4 py-5">
            <p className="text-[10px] tracking-[0.28em] text-gold-soft">{shop.en}</p>
            <p className="mt-1 text-lg font-semibold">پنل مدیریت</p>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-3 pb-4 md:block md:space-y-1 md:px-3">
            {links.map((link) => {
              const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block shrink-0 px-3 py-2 text-sm ${active ? "bg-white/10 text-gold-soft" : "hover:bg-white/5"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex gap-3 px-4 py-4 text-sm md:block md:space-y-3">
            <Link href="/" className="block text-cream/70 hover:text-white">
              فروشگاه
            </Link>
            <button type="button" onClick={logout} className="block text-cream/70 hover:text-white">
              خروج
            </button>
          </div>
        </aside>
        <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession() {
  const value = useContext(AdminSessionContext);
  if (!value) throw new Error("useAdminSession must be used in the admin panel");
  return value;
}
