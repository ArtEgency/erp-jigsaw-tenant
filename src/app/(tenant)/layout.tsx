import { AuthLayout } from "@/lib/auth";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout loginPath="/login">{children}</AuthLayout>;
}
