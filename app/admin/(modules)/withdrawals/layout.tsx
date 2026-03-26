"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../../../context/AdminContext";

export default function WithdrawalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (admin && admin.role !== "superadmin") {
      router.replace("/admin");
    }
  }, [admin, router]);

  if (!admin) return null;

  if (admin.role !== "superadmin") return null;

  return <>{children}</>;
}