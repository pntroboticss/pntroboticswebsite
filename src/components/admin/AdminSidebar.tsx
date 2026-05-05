"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard, Image as ImageIcon, Briefcase, GraduationCap,
    FileText, Settings, LogOut, Users, MessageSquare, Inbox,
    ThumbsDown, Ticket, Video, HelpCircle, ExternalLink, X, Box, type LucideIcon
} from "lucide-react";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { useSidebar } from "./SidebarContext";

type NavItem = { name: string; href: string; icon: LucideIcon };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
    {
        label: "Overview",
        items: [{ name: "Overview", href: "/admin", icon: LayoutDashboard }],
    },
    {
        label: "Enquiries & Finance",
        items: [
            { name: "Enquiries", href: "/admin/enquiries", icon: Inbox },
            { name: "Payment Tickets", href: "/admin/tickets", icon: Ticket },
        ],
    },
    {
        label: "Content",
        items: [
            { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
            { name: "School Videos", href: "/admin/videos", icon: Video },
            { name: "About Photos", href: "/admin/about", icon: Users },
            { name: "News & Blog", href: "/admin/blog", icon: FileText },
        ],
    },
    {
        label: "Partnerships",
        items: [
            { name: "Partner Schools", href: "/admin/schools", icon: GraduationCap },
            { name: "Partners & Logos", href: "/admin/partners", icon: Briefcase },
            { name: "Internships", href: "/admin/internships", icon: Briefcase },
        ],
    },
    {
        label: "3D Content",
        items: [
            { name: "3D Hardware Models", href: "/admin/hardware-models", icon: Box },
        ],
    },
    {
        label: "Engagement",
        items: [
            { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
            { name: "FAQs", href: "/admin/faq", icon: HelpCircle },
            { name: "AI Feedback", href: "/admin/ai-feedback", icon: ThumbsDown },
        ],
    },
    {
        label: "System",
        items: [{ name: "Settings", href: "/admin/settings", icon: Settings }],
    },
];

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        if (auth) await signOut(auth);
        router.push("/admin/login");
    };

    return (
        <div className="flex flex-col h-full relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
                <motion.div
                    className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-indigo-100/70 dark:bg-indigo-900/20 blur-3xl"
                    animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/2 -right-20 w-52 h-52 rounded-full bg-violet-100/60 dark:bg-violet-900/15 blur-3xl"
                    animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
                <motion.div
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-blue-100/50 dark:bg-blue-900/15 blur-3xl"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                />
                <div className="absolute inset-0 dark:hidden bg-[radial-gradient(circle,_#6366f120_1px,_transparent_1px)] bg-[size:20px_20px] opacity-60" />
                <div className="absolute inset-0 hidden dark:block bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
            </div>

            {/* Logo */}
            <div className="relative px-5 pt-6 pb-5 border-b border-slate-100 dark:border-white/[0.06]">
                <Link href="/admin" onClick={onLinkClick} className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
                    <div className="relative w-28 h-8 mx-auto">
                        <Image
                            src="/logo.png"
                            alt="PNT Academy"
                            fill
                            className="object-contain invert dark:invert-0 drop-shadow-sm transition-all duration-500"
                        />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-400 mt-1">
                        Admin Panel
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="relative flex-1 px-3 py-4 overflow-y-auto scrollbar-hide space-y-5">
                {NAV_GROUPS.map((group, gi) => (
                    <div key={group.label}>
                        {gi > 0 && <div className="h-px bg-slate-200 dark:bg-white/[0.05] mx-2 mb-3" />}
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500 px-3 mb-1.5">
                            {group.label}
                        </p>
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/admin" && pathname.startsWith(item.href));

                                return (
                                    <Link key={item.href} href={item.href} className="block" onClick={onLinkClick}>
                                        <div className="relative">
                                            {isActive && (
                                                <motion.div
                                                    layoutId="sidebar-active-pill"
                                                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-indigo-600 dark:to-indigo-500 shadow-lg shadow-indigo-400/20 dark:shadow-indigo-900/40"
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                                                />
                                            )}
                                            <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${
                                                isActive
                                                    ? "text-white"
                                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.04]"
                                            }`}>
                                                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-indigo-100" : "text-slate-400 dark:text-slate-500"}`} />
                                                {item.name}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom actions */}
            <div className="relative px-3 py-4 border-t border-slate-100 dark:border-white/[0.06] space-y-0.5">
                <Link
                    href="/"
                    target="_blank"
                    onClick={onLinkClick}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-colors group"
                >
                    <ExternalLink className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors" />
                    View Live Site
                </Link>
                <button
                    onClick={async () => { onLinkClick?.(); await handleLogout(); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/[0.08] transition-colors group"
                >
                    <LogOut className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-red-500 transition-colors" />
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
            {/* ── Desktop sidebar (md and up) ── */}
            <aside className="
                hidden md:flex flex-col w-60 min-h-screen sticky top-0 z-20
                bg-white dark:bg-[#080c1a]
                border-r border-slate-200 dark:border-white/[0.06]
                transition-colors duration-300
            ">
                <SidebarContent />
            </aside>

            {/* ── Mobile: Backdrop ── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                        onClick={close}
                        aria-hidden
                    />
                )}
            </AnimatePresence>

            {/* ── Mobile: Off-canvas drawer ── */}
            <AnimatePresence>
                {open && (
                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed left-0 top-0 bottom-0 z-50 w-72 md:hidden
                            bg-white dark:bg-[#080c1a]
                            border-r border-slate-200 dark:border-white/[0.06]
                            shadow-2xl overflow-hidden"
                    >
                        {/* Close button */}
                        <button
                            onClick={close}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <SidebarContent onLinkClick={close} />
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
