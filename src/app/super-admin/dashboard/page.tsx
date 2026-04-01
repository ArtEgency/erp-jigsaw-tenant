"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/super-admin/onboarding");
  }, [router]);

  return null;
}
