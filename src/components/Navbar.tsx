"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sun, Moon, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NavItemType = {
    label: string;
    sublabel?: string;
    href: string;
    icon: string;
    dropdown?: { label: string; href: string }[];
};

const NAV_ITEMS: NavItemType[] = [
    {
        label: "Home",
        href: "/",
        icon: "🏠",
    },
    {
        label: "Products",
        href: "/products",
        icon: "⚙️",
    },
    {
        label: "Services",
        href: "/services",
        icon: "💻",
    },
    {
        label: "About Us",
        href: "/about",
        icon: "🏢",
    },
    {
        label: "Careers",
        href: "/careers",
        icon: "💼",
    },
];

const SIMPLE_LINKS: { label: string; href: string }[] = [];

// ─── Desktop NavLink ──────────────────────────────────────────────────────────
function NavLink({ item, isActive }: { item: NavItemType; isActive: boolean }) {
    return (
        <div className="relative group">
            <Link
                href={item.href}
                className={`relative z-10 flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 whitespace-nowrap
                    ${isActive
                        ? "text-cyan-600 dark:text-cyan-400"
                        : "text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400"
                    }`}
            >
                {isActive && (
                    <motion.span
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-cyan-200 dark:ring-cyan-500/30 -z-10"
                        transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.8 }}
                    />
                )}
                {isActive && (
                    <motion.span
                        layoutId="activeGlow"
                        className="absolute inset-0 rounded-xl -z-20 blur-md"
                        animate={{
                            boxShadow: [
                                "0 0 12px 4px rgba(6,182,212,0.35)",
                                "0 0 22px 8px rgba(99,102,241,0.35)",
                                "0 0 12px 4px rgba(6,182,212,0.35)",
                            ],
                        }}
                        transition={{
                            boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                            layout: { type: "spring", stiffness: 280, damping: 28, mass: 0.8 },
                        }}
                    />
                )}
                <span className="hidden sm:inline">{item.icon}</span>
                {item.label}
                {item.sublabel && <span className="hidden xl:inline text-slate-400 dark:text-slate-500 font-normal">&nbsp;{item.sublabel}</span>}
            </Link>
            
            {/* Dropdown Menu */}
            {item.dropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                    <div className="py-2">
                        {item.dropdown.map(drop => (
                            <Link key={drop.href} href={drop.href} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                                {drop.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => { setMobileOpen(false); }, [pathname]);

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-black/10 dark:border-white/10 transition-colors duration-500">
            <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 relative z-10 hover:opacity-80 transition-opacity">
                    <div className="relative w-48 sm:w-64 h-14 sm:h-16 flex items-center justify-center">
                        <Image
                            src="/PNT Robo logo.png"
                            alt="PNT Robotics Logo"
                            fill
                            className="object-contain object-left transition-all duration-500 dark:invert dark:hue-rotate-180"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
                    {NAV_ITEMS.map((item) => (
                        <NavLink key={item.href} item={item} isActive={isActive(item.href)} />
                    ))}

                    <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

                    {SIMPLE_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                                ${isActive(link.href)
                                    ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-[0_4px_16px_rgba(6,182,212,0.25)] -translate-y-0.5 ring-1 ring-cyan-200 dark:ring-cyan-500/30"
                                    : "text-slate-600 dark:text-slate-300 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-white/5"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}


                    <Link 
                        href="/contact"
                        className="ml-2 px-5 py-2.5 rounded-full font-bold text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-cyan-600 dark:hover:bg-cyan-400 hover:text-white dark:hover:text-slate-900 transition-all shadow-md shadow-slate-900/10 dark:shadow-white/10 relative overflow-hidden group"
                    >
                        <span className="relative z-10">Contact Us</span>
                        <motion.div
                            className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/30 dark:via-slate-900/20 to-transparent skew-x-[-20deg] w-[150%] -left-[150%]"
                            animate={{ left: ["-150%", "150%"] }}
                            transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                        />
                    </Link>

                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                    )}


                </nav>

                {/* Mobile Controls */}
                <div className="lg:hidden flex items-center gap-2">
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    )}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                        aria-label="Open Menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* ── Mobile Slide-Down Menu ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="lg:hidden overflow-hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-black/10 dark:border-white/10"
                    >
                        <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
                            {NAV_ITEMS.map((item) => (
                                <div key={item.href} className="flex flex-col">
                                    <Link
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${isActive(item.href)
                                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-400"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                                            }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <div>
                                            <div>{item.label}</div>
                                            {item.sublabel && <div className="text-xs text-slate-400 font-normal">{item.sublabel}</div>}
                                        </div>
                                    </Link>
                                    {item.dropdown && (
                                        <div className="flex flex-col ml-12 mt-1 gap-1 border-l border-slate-200 dark:border-slate-800 pl-3">
                                            {item.dropdown.map(drop => (
                                                <Link 
                                                    key={drop.href} 
                                                    href={drop.href}
                                                    onClick={() => setMobileOpen(false)}
                                                    className="py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                                >
                                                    {drop.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="h-px bg-slate-200 dark:bg-white/10 my-1" />

                            {SIMPLE_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${isActive(link.href)
                                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-400"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="mt-4 pb-2 px-2">
                                <Link 
                                    href="/contact"
                                    onClick={() => setMobileOpen(false)}
                                    className="block w-full text-center px-5 py-3 rounded-xl font-bold text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-cyan-600 dark:hover:bg-cyan-400 hover:text-white dark:hover:text-slate-900 transition-all shadow-md shadow-slate-900/10 dark:shadow-white/10 relative overflow-hidden group"
                                >
                                    <span className="relative z-10">Contact Us</span>
                                    <motion.div
                                        className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/30 dark:via-slate-900/20 to-transparent skew-x-[-20deg] w-[150%] -left-[150%]"
                                        animate={{ left: ["-150%", "150%"] }}
                                        transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                                    />
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
