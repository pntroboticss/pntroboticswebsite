"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function CyberGridBackground() {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setMounted(true);
        
        // Only run on desktop
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (isMobile) return;

        const handleMouseMove = (e: MouseEvent) => {
            // Normalized coordinates: -1 to 1
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            setMousePos({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    if (!mounted) return null;

    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDark = currentTheme === "dark";

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
            {/* Glowing Orbs, reacting to mouse position for depth */}
            <div 
                className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[120px] transition-transform duration-200 ease-out" 
                style={{ transform: `translate(calc(-50% + ${mousePos.x * -80}px), calc(-50% + ${mousePos.y * -80}px))` }}
            />
            <div 
                className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cyan-400/20 dark:bg-cyan-500/20 rounded-full blur-[80px] transition-transform duration-100 ease-out" 
                style={{ transform: `translate(calc(-50% + ${mousePos.x * -40}px), calc(-50% + ${mousePos.y * -40}px))` }}
            />

            {/* 3D Perspective Grid reacting to cursor */}
            <div className="absolute inset-0 [perspective:1000px]">
                <div 
                    className="absolute inset-0 origin-bottom transition-transform duration-300 ease-out"
                    style={{
                        transform: `rotateX(${60 - mousePos.y * 5}deg) rotateY(${mousePos.x * 5}deg) translateY(100px) scale(2.5)`,
                    }}
                >
                    <div 
                        className="absolute inset-0 animate-grid-scroll"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, ${isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(14, 165, 233, 0.3)'} 1px, transparent 1px),
                                linear-gradient(to bottom, ${isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(14, 165, 233, 0.3)'} 1px, transparent 1px)
                            `,
                            backgroundSize: '50px 50px',
                        }}
                    />
                </div>
            </div>

            {/* Vignette effect to fade out the edges */}
            <div className="absolute inset-0 bg-radial-vignette mix-blend-multiply dark:mix-blend-overlay opacity-90" />
            
            {/* Top fade out to hide the grid horizon */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-slate-50 dark:from-[#020617] to-transparent" />
        </div>
    );
}
