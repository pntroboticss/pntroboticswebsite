"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function AuroraBackground() {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDark = currentTheme === "dark";

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            {/* Base color */}
            <div className={`absolute inset-0 transition-colors duration-700 ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`} />

            {/* Aurora layers */}
            <div 
                className={`absolute -top-[50%] -left-[50%] w-[200%] h-[200%] mix-blend-overlay opacity-50 dark:opacity-40 animate-aurora-1`}
                style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${isDark ? 'rgba(56, 189, 248, 0.4)' : 'rgba(14, 165, 233, 0.2)'} 0%, transparent 50%)`
                }}
            />
            <div 
                className={`absolute -top-[50%] -left-[50%] w-[200%] h-[200%] mix-blend-overlay opacity-50 dark:opacity-40 animate-aurora-2`}
                style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(99, 102, 241, 0.2)'} 0%, transparent 50%)`
                }}
            />
            <div 
                className={`absolute -top-[50%] -left-[50%] w-[200%] h-[200%] mix-blend-overlay opacity-30 dark:opacity-20 animate-aurora-3`}
                style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, ${isDark ? 'rgba(45, 212, 191, 0.4)' : 'rgba(20, 184, 166, 0.2)'} 0%, transparent 50%)`
                }}
            />

            {/* Grain overlay for texture */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 dark:opacity-10 mix-blend-overlay" />
        </div>
    );
}
