import type { Metadata } from "next";
import { CustomersPanel } from "@/components/admin/CustomersPanel";

export const metadata: Metadata = { title: "خریداران" };

export default function CustomersPage() {
  return <CustomersPanel />;
}
