"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Menu, Bell } from "lucide-react";
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
    let breadcrumbText = "Dashboard";
    if (pathSegments.length > 1) {
        breadcrumbText = pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1).replace("-", " ");
    }

    useEffect(() => {
        setMounted(true);
        // Ensure default theme is dark for the admin panel if not set
        if (!theme) setTheme("dark");
        
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
    }, [theme, setTheme]);

    return (
        <header className="h-16 bg-white dark:bg-[#0B0F19]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between px-4 sm:px-8 z-10 sticky top-0 transition-colors duration-500">
            {/* Left: Hamburger (mobile) + Breadcrumb */}
            <div className="flex items-center gap-4 text-sm font-medium">
                {/* Mobile hamburger */}
                <button
                    onClick={toggle}
                    className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={18} />
                </button>
                <div className="hidden sm:flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400">PNT Robotics</span>
                    <span className="text-slate-300 dark:text-slate-600">/</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{breadcrumbText}</span>
                </div>
            </div>

            {/* Actions Right */}
            <div className="flex items-center gap-3 sm:gap-5">
                
                {/* Notifications */}
                <button className="p-2 text-slate-400 hover:text-indigo-400 transition-colors relative">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-[#0B0F19]"></span>
                </button>

                {/* Theme Toggle */}
                {mounted && (
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 transition-colors"
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                )}

                {/* Vertical Divider */}
                <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

                {/* Admin Avatar & Name */}
                <Link href="/admin/settings" className="flex items-center gap-3 group">
                    <div className="flex flex-col items-end hidden md:flex">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-400 transition-colors">
                            {adminData?.name || "Administrator"}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                            Master Access
                        </span>
                    </div>
                    <div className="h-9 w-9 rounded-xl relative overflow-hidden bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-sm ring-1 ring-indigo-500/20 group-hover:ring-indigo-500/50 transition-all">
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
