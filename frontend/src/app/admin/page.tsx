import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "خلاصه پنل" };

export default function AdminHomePage() {
  return <AdminDashboard />;
}
