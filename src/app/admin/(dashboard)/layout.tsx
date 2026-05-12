import AuthGuard from "@/components/admin/AuthGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { SidebarProvider } from "@/components/admin/SidebarContext";

export const metadata = {
    title: "Admin Dashboard | PNT Robotics",
    description: "Secure management portal for PNT Robotics content.",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <SidebarProvider>
                <div className="flex min-h-screen bg-slate-50 dark:bg-[#030712] transition-colors duration-500 text-slate-900 dark:text-slate-100">
                    {/* Vertical Sidebar */}
                    <AdminSidebar />

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden min-w-0">

                        {/* Dashboard Header/Topbar */}
                        <AdminTopbar />

                        {/* Page Content */}
                        <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10">
                            <div className="max-w-7xl mx-auto">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </AuthGuard>
    );
}
