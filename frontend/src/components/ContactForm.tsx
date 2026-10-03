"use client";

import { FormEvent, useState } from "react";
import { postJson } from "@/lib/api";
import { btnPrimary, fieldClass, labelClass } from "@/lib/shop";

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const data = new FormData(event.currentTarget);
    setPending(true);
    try {
      const result = await postJson<{ message: string }>("/api/messages", {
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        body: String(data.get("body") ?? ""),
      });
      setMessage(result.message);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "پیام ثبت نشد.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className={labelClass}>نام</span>
        <input name="name" required autoComplete="name" className={fieldClass} />
      </label>
      <label className="block">
        <span className={labelClass}>موبایل</span>
        <input name="phone" required autoComplete="tel" className={fieldClass} />
      </label>
      <label className="block">
        <span className={labelClass}>ایمیل</span>
        <input name="email" type="email" autoComplete="email" className={fieldClass} />
      </label>
      <label className="block">
        <span className={labelClass}>پیام</span>
        <textarea name="body" required rows={5} className={fieldClass} />
      </label>
      {error ? <p className="text-sm text-red-800">{error}</p> : null}
      {message ? <p className="text-sm text-olive">{message}</p> : null}
      <button type="submit" className={btnPrimary} disabled={pending}>
        {pending ? "در حال ارسال..." : "ارسال پیام"}
      </button>
    </form>
  );
}
