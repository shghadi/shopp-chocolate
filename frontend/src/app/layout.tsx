import type { Metadata } from "next";
import localFont from "next/font/local";
import { CartProvider } from "@/components/CartProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const vazir = localFont({
  src: [
    { path: "../fonts/Vazirmatn-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Vazirmatn-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "شکلات زرین",
    template: "%s | شکلات زرین",
  },
  description: "فروشگاه شکلات کادویی، مناسبتی و فله. جعبه‌های هدیه و فروش وزنی.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazir.className} min-h-screen antialiased`}>
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
