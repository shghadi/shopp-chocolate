"use client";

import { FormEvent, useState } from "react";
import { useAdminSession } from "@/components/admin/AdminShell";
import { adminLogin } from "@/lib/adminApi";
import { btnPrimary, fieldClass, labelClass } from "@/lib/shop";

export function AdminLogin() {
  const { login } = useAdminSession();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    setPending(true);
    try {
      const result = await adminLogin(String(data.get("username") ?? ""), String(data.get("password") ?? ""));
      login(result.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "ورود انجام نشد.");
      setPending(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm border border-line bg-white p-6">
        <p className="text-xs tracking-[0.28em] text-gold">ZARRIN</p>
        <h1 className="mt-2 text-2xl font-semibold text-cocoa">ورود به پنل</h1>
        <p className="mt-2 text-sm leading-7 text-muted">موجودی، سفارش‌ها و خریداران از اینجا مدیریت می‌شود.</p>
        <label className="mt-6 block">
          <span className={labelClass}>نام کاربری</span>
          <input name="username" autoComplete="username" required className={fieldClass} />
        </label>
        <label className="mt-4 block">
          <span className={labelClass}>رمز</span>
          <input name="password" type="password" autoComplete="current-password" required className={fieldClass} />
        </label>
        {error ? <p className="mt-3 text-sm text-red-800">{error}</p> : null}
        <button type="submit" className={`${btnPrimary} mt-6 w-full`} disabled={pending}>
          {pending ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </div>
  );
}
