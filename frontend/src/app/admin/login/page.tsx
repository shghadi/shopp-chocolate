import type { Metadata } from "next";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const metadata: Metadata = { title: "ورود پنل" };

export default function AdminLoginPage() {
  return <AdminLogin />;
}
