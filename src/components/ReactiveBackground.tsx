"use client";

import { useEffect, useState } from "react";

export default function ReactiveBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

    useEffect(() => {
        let animationFrameId: number;

        const handleMouseMove = (e: MouseEvent) => {
            // Use requestAnimationFrame for smooth 60fps performance
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                setMousePosition({
                    x: (e.clientX / window.innerWidth) * 100,
                    y: (e.clientY / window.innerHeight) * 100,
                });
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[-1] pointer-events-none transition-colors duration-500 bg-slate-950"
            style={{
                background: `radial-gradient(1000px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.15) 35%, rgba(15, 23, 42, 0.95) 75%, rgba(2, 6, 23, 1) 100%)`
            }}
        >
            <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[140px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-fuchsia-600/20 blur-[140px] rounded-full mix-blend-screen" />
        </div>
    );
}
