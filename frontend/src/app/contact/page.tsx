import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { shop } from "@/lib/shop";

export const metadata: Metadata = { title: "تماس با ما" };

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-semibold text-cocoa">تماس با ما</h1>
        <p className="mt-4 text-sm leading-8 text-muted">
          برای سفارش عمده فله، هدیه سازمانی یا سوال درباره موجودی، پیام بگذارید یا زنگ بزنید.
        </p>
        <ul className="mt-8 space-y-3 text-sm leading-7">
          <li>{shop.address}</li>
          <li>
            <a href={shop.phoneHref} className="hover:text-gold">
              {shop.phone}
            </a>
          </li>
          <li>
            <a href={`mailto:${shop.email}`} className="hover:text-gold">
              {shop.email}
            </a>
          </li>
          <li>{shop.hours}</li>
        </ul>
      </div>
      <ContactForm />
    </div>
  );
}
