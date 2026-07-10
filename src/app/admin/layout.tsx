import AdminDirectAccessGuard from "@/components/admin/AdminDirectAccessGuard";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminDirectAccessGuard>{children}</AdminDirectAccessGuard>;
}
