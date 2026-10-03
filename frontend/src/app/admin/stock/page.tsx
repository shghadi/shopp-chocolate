import type { Metadata } from "next";
import { StockPanel } from "@/components/admin/StockPanel";

export const metadata: Metadata = { title: "موجودی" };

export default function StockPage() {
  return <StockPanel />;
}
