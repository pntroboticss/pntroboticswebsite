"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, User, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";

export default function AdminTopbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [adminData, setAdminData] = useState<{ name?: string, profileImage?: string | null } | null>(null);
    const pathname = usePathname();
    const { toggle } = useSidebar();

    // Generate Breadcrumb
    const pathSegments = pathname.split('/').filter(Boolean);
    let breadcrumbText = "Overview";
    if (pathSegments.length > 1) {
        breadcrumbText = pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1).replace("-", " ");
    }

    useEffect(() => {
        setMounted(true);
        // Fetch admin settings for profile pic and name
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings");
                if (res.ok) {
                    const data = await res.json();
                    setAdminData(data);
                }
            } catch (err) {
                console.error("Failed to fetch admin data", err);
            }
        };
        fetchSettings();
    }, []);

    return (
        <header className="h-16 bg-white dark:bg-[#0A0A0A] border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-4 sm:px-8 z-10 sticky top-0 transition-colors duration-500">
            {/* Left: Hamburger (mobile) + Breadcrumb */}
            <div className="flex items-center gap-3 text-sm font-medium">
                {/* Mobile hamburger */}
                <button
                    onClick={toggle}
                    className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={18} />
                </button>
                <span className="text-slate-400">Admin</span>
                <span className="mx-1 text-slate-300 dark:text-slate-600">/</span>
                <span className="text-slate-900 dark:text-slate-100 truncate max-w-[120px] sm:max-w-none">{breadcrumbText}</span>
            </div>

            {/* Actions Right */}
            <div className="flex items-center gap-4">

                {/* Theme Toggle */}
                {mounted && (
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                )}

                {/* Vertical Divider */}
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

                {/* System Status */}
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:inline-block">System Online</span>

                {/* Admin Avatar & Name */}
                <Link href="/admin/settings" className="flex items-center gap-3 ml-4 group">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden md:block group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {adminData?.name || "Admin"}
                    </span>
                    <div className="h-8 w-8 rounded-full relative overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs ring-1 ring-slate-200 dark:ring-white/10 group-hover:ring-slate-300 dark:group-hover:ring-white/20 transition-all">
                        {adminData?.profileImage ? (
                            <Image
                                src={adminData.profileImage}
                                alt="Admin Avatar"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span>{adminData?.name?.[0]?.toUpperCase() || "A"}</span>
                        )}
                    </div>
                </Link>
            </div>
        </header>
    );
}
