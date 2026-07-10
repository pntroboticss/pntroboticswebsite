"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, ImageIcon, Briefcase, GraduationCap,
    FileText, Settings, LogOut, Users, MessageSquare, Inbox,
    Ticket, Video, HelpCircle, ExternalLink, X, Box, Rocket, Star, type LucideIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSidebar } from "./SidebarContext";
import Image from "next/image";

type NavItem = { name: string; href: string; icon: LucideIcon };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
    {
        label: "General",
        items: [
            { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
            { name: "Careers", href: "/admin/careers", icon: Briefcase },
            { name: "Services", href: "/admin/services", icon: Briefcase },
        ],
    },
    {
        label: "Leads & Contacts",
        items: [
            { name: "Standard Contacts", href: "/admin/contacts", icon: MessageSquare },
            { name: "Custom Projects", href: "/admin/projects", icon: Rocket },
        ],
    },
    {
        label: "Media",
        items: [
            { name: "Testimonials", href: "/admin/testimonials", icon: Star },
            { name: "Highlights", href: "/admin/highlights", icon: ImageIcon },
            { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
        ],
    },
    {
        label: "Portfolio",
        items: [
            { name: "Products", href: "/admin/products", icon: Box },
        ],
    },
];

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 transition-colors">
            {/* Logo Area */}
            <div className="px-6 py-8 border-b border-slate-200 dark:border-slate-800/60">
                <Link href="/admin" onClick={onLinkClick} className="flex flex-col gap-2 hover:opacity-80 transition-opacity">
                    <div className="relative w-full h-24 flex items-center">
                        <Image
                            src="/PNT Robo logo.png"
                            alt="PNT Robotics Logo"
                            fill
                            sizes="256px"
                            className="object-contain object-left transition-all duration-500 dark:invert dark:hue-rotate-180"
                            priority
                        />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 pl-1">
                        Command Center
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide space-y-6">
                {NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 px-2 mb-2">
                            {group.label}
                        </p>
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/admin" && pathname.startsWith(item.href));

                                return (
                                    <Link key={item.href} href={item.href} className="block" onClick={onLinkClick}>
                                        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                                            }`}>
                                            <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                                            {item.name}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800/60 space-y-2">
                <Link
                    href="/"
                    target="_blank"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all"
                >
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                    Visit Website
                </Link>
                <button
                    onClick={async () => { onLinkClick?.(); await handleLogout(); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                >
                    <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-500" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

export default function AdminSidebar() {
    const { open, close } = useSidebar();

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden md:block w-64 min-h-screen sticky top-0 z-20">
                <SidebarContent />
            </aside>

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-sm md:hidden"
                        onClick={close}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {open && (
                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        className="fixed left-0 top-0 bottom-0 z-50 w-72 md:hidden shadow-2xl bg-white dark:bg-slate-900"
                    >
                        <button
                            onClick={close}
                            className="absolute top-6 right-4 z-10 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <SidebarContent onLinkClick={close} />
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
