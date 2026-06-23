"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface SectorHeroHeaderProps {
    title: string;
    description: string;
    accentColor: "cyan" | "red" | "green" | "purple" | "yellow";
}

const colorMap = {
    cyan: "bg-cyan-500",
    red: "bg-red-500",
    green: "bg-emerald-500",
    purple: "bg-purple-500",
    yellow: "bg-amber-500",
};

const borderMap = {
    cyan: "border-cyan-500/30",
    red: "border-red-500/30",
    green: "border-emerald-500/30",
    purple: "border-purple-500/30",
    yellow: "border-amber-500/30",
};

export default function SectorHeroHeader({ title, description, accentColor }: SectorHeroHeaderProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const { currentTarget, clientX, clientY } = e;
        const { left, top } = currentTarget.getBoundingClientRect();
        setMousePosition({ x: clientX - left, y: clientY - top });
    };

    return (
        <section 
            onMouseMove={handleMouseMove}
            className="relative w-full py-32 overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a] group"
        >
            {/* Interactive Glowing Orb that follows mouse */}
            <motion.div 
                className={`absolute w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none opacity-0 group-hover:opacity-15 dark:group-hover:opacity-20 transition-opacity duration-700 ${colorMap[accentColor]}`}
                animate={{
                    x: mousePosition.x - 300,
                    y: mousePosition.y - 300,
                }}
                transition={{ type: "tween", ease: "circOut", duration: 1 }}
            />

            {/* Static Ambient Glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[300px] rounded-[100%] blur-[120px] opacity-[0.05] dark:opacity-10 pointer-events-none ${colorMap[accentColor]}`} />

            {/* Grid Pattern */}
            <div 
                className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwaGF0aCBkPSJNMCAwdjQwTTAgMGg0MCIgc3Ryb2tlPSJyZ2JhKDEyOCwxMjgsMTI4LDAuMTUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-60 dark:opacity-30 pointer-events-none"
                style={{ maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)' }}
            />
            
            {/* Animated Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${borderMap[accentColor]} bg-white/80 dark:bg-black/50 backdrop-blur-md mb-8 shadow-sm`}
                >
                    <span className={`w-2 h-2 rounded-full animate-pulse ${colorMap[accentColor]}`} />
                    <span className="text-xs font-bold tracking-widest uppercase text-slate-700 dark:text-slate-300">
                        {title}
                    </span>
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-8"
                >
                    {title}
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                    className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
                >
                    {description}
                </motion.p>
            </div>
        </section>
    );
}
