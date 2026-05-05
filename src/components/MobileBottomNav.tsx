"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Cpu, BookOpen, School, Target } from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
    { label: "Home", href: "/", icon: Home },
    { label: "Robotics LAB", href: "/schools/robotics-lab", icon: Cpu },
    { label: "Kids Courses", href: "/programs/courses-for-kids", icon: BookOpen },
    { label: "For Schools", href: "/programs/schools", icon: School },
    { label: "For Colleges", href: "/programs/colleges", icon: Target },
];

export default function MobileBottomNav() {
    const router = useRouter();
    const pathname = usePathname();
    const [activeIndex, setActiveIndex] = useState(0);
    const navRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    // Sync initial index
    useEffect(() => {
        const idx = NAV_ITEMS.findIndex(item => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)));
        if (idx !== -1) {
            setActiveIndex(idx);
            // Wait slightly for DOM to render the flex container
            setTimeout(() => centerItem(idx), 100);
        }
    }, [pathname]);

    const centerItem = (index: number) => {
        if (!navRef.current) return;
        const container = navRef.current;
        const children = Array.from(container.children) as HTMLElement[];
        const items = children.filter(c => c.dataset.index !== undefined);
        const target = items.find(c => parseInt(c.dataset.index!) === index);
        
        if (target) {
            const scrollLeft = target.offsetLeft - container.clientWidth / 2 + target.clientWidth / 2;
            container.scrollTo({ left: scrollLeft, behavior: "smooth" });
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const center = container.scrollLeft + container.clientWidth / 2;
        
        const children = Array.from(container.children) as HTMLElement[];
        const items = children.filter(c => c.dataset.index !== undefined);
        
        let closest = 0;
        let minDist = Infinity;

        items.forEach((item) => {
            const itemCenter = item.offsetLeft + item.clientWidth / 2;
            const dist = Math.abs(center - itemCenter);
            if (dist < minDist) {
                minDist = dist;
                closest = parseInt(item.dataset.index!);
            }
        });

        if (closest !== activeIndex) {
            setActiveIndex(closest);
        }

        // Auto-navigate after resting ("the one i stay at will open")
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            const targetRoute = NAV_ITEMS[closest].href;
            if (pathname !== targetRoute && !pathname.startsWith(targetRoute)) {
                router.push(targetRoute);
            }
        }, 300); // 300ms fast-trigger once scroll resting settles
    };

    return (
        <div className="md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 z-40 w-[260px] rounded-full backdrop-blur-2xl bg-black/80 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-500 overflow-hidden pb-[env(safe-area-inset-bottom)] p-1">
            <div 
                ref={navRef}
                onScroll={handleScroll}
                className="flex items-center overflow-x-auto snap-x snap-mandatory scrollbar-hide h-[60px] relative w-full" 
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {/* Spacers ensure first and last items can reach exact center (container half minus item half) */}
                <div className="shrink-0 w-[102px]" />

                {NAV_ITEMS.map((item, i) => {
                    const isActive = activeIndex === i;
                    // Subtler semi-circular drop for a clean, non-bulky arch
                    const distance = Math.abs(activeIndex - i);
                    const translateY = Math.min(distance * 6, 16); 
                    const scale = isActive ? 1.05 : Math.max(0.7, 0.95 - (distance * 0.1));
                    const opacity = isActive ? 1 : Math.max(0.3, 0.8 - (distance * 0.2));

                    return (
                        <button
                            key={item.href}
                            data-index={i}
                            onClick={() => {
                                setActiveIndex(i);
                                centerItem(i);
                                router.push(item.href);
                            }}
                            className="shrink-0 w-[56px] h-full flex flex-col items-center justify-center snap-center relative"
                        >
                            <motion.div
                                animate={{ y: translateY, scale, opacity }}
                                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                className="flex flex-col items-center w-full relative h-full justify-center"
                            >
                                <div className={`p-2 rounded-full transition-colors ${isActive ? "bg-gradient-to-tr from-cyan-400 to-blue-600 text-white shadow-[0_0_15px_rgba(34,211,238,0.6)] ring-1 ring-white/30" : "text-white/60"}`}>
                                    <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                {isActive && (
                                    <motion.span 
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-[8px] font-black tracking-widest uppercase text-white mt-1 w-[140%] text-center ml-[-20%]"
                                        style={{ textShadow: "0 0 6px rgba(34,211,238,0.8)" }}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </motion.div>
                        </button>
                    );
                })}

                {/* Spacers ensure first and last items can reach exact center */}
                <div className="shrink-0 w-[102px]" />
            </div>
            
            {/* Nav Active Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
        </div>
    );
}
