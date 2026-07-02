"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Package, Wrench, Info, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
    { label: "Products", href: "/products", icon: Package },
    { label: "Services", href: "/services", icon: Wrench },
    { label: "Home", href: "/", icon: Home, isFab: true },
    { label: "About", href: "/about", icon: Info },
    { label: "Careers", href: "/careers", icon: Briefcase },
];

export default function MobileBottomNav() {
    const router = useRouter();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
    const isNavigating = useRef(false);

    // Temporarily ignore scroll events (e.g. during programmatic scrolling)
    const ignoreScrollTemporarily = () => {
        isNavigating.current = true;
        setTimeout(() => {
            isNavigating.current = false;
        }, 1000);
    };

    // Reset navigation flag after route change
    useEffect(() => {
        ignoreScrollTemporarily();
    }, [pathname]);

    // Listen to Mobile Menu events from Navbar
    useEffect(() => {
        const handleMenuOpen = () => {
            setIsMenuOpen(true);
            setIsVisible(false);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
        const handleMenuClose = () => {
            setIsMenuOpen(false);
            setIsVisible(true);
            ignoreScrollTemporarily(); // Ignore scroll right after menu closes (e.g. clicked a link)
        };

        window.addEventListener("mobileMenuOpen", handleMenuOpen);
        window.addEventListener("mobileMenuClose", handleMenuClose);

        return () => {
            window.removeEventListener("mobileMenuOpen", handleMenuOpen);
            window.removeEventListener("mobileMenuClose", handleMenuClose);
        };
    }, []);

    // Auto-hide on scroll logic: Hide while scrolling, show when stopped
    useEffect(() => {
        const handleScroll = () => {
            if (isNavigating.current) return;

            // Hide nav while actively scrolling
            setIsVisible(false);
            
            // Clear existing timeout
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
            
            // Show nav again after scrolling stops (e.g., 400ms delay)
            scrollTimeout.current = setTimeout(() => {
                setIsVisible(true);
            }, 400);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && !isMenuOpen && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[400px]"
                >
                    <div className="relative flex items-center justify-between px-3 py-2 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-200/50 dark:border-slate-800/50">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                            if (item.isFab) {
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => {
                                            ignoreScrollTemporarily();
                                            router.push(item.href);
                                        }}
                                        className="relative -translate-y-5 flex flex-col items-center justify-center shrink-0 w-[60px] h-[60px] bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/40 text-white hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        <item.icon className="w-6 h-6" strokeWidth={2.5} />
                                    </button>
                                );
                            }

                            return (
                                <button
                                    key={item.href}
                                    onClick={() => {
                                        ignoreScrollTemporarily();
                                        router.push(item.href);
                                    }}
                                    className="relative flex flex-col items-center justify-center w-[60px] h-[52px] rounded-2xl"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="mobile-nav-pill"
                                            className="absolute inset-0 bg-blue-50 dark:bg-slate-800 rounded-2xl -z-10"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <item.icon 
                                        className={`w-5 h-5 mb-1 transition-colors ${isActive ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"}`} 
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    <span className={`text-[10px] font-semibold transition-colors ${isActive ? "text-cyan-700 dark:text-cyan-300" : "text-slate-500 dark:text-slate-400"}`}>
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
