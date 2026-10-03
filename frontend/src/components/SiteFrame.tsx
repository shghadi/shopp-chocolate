"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";

export function SiteFrame({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <main>{children}</main>;

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      {footer}
    </>
  );
}
