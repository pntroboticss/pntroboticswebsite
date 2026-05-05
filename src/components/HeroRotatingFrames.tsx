"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────
// ADD YOUR PHOTOS to:  public/colleges-hero/
// Name them:  1.jpg  2.jpg  3.jpg  4.jpg  (or .png / .webp)
// They will automatically appear in the hero slider above.
// ─────────────────────────────────────────────────────────────────

const LOCAL_IMAGES = [
    "/colleges-hero/PNT_labwork.jpeg",
    "/colleges-hero/PNT_labwork2.jpeg",
    "/colleges-hero/PNT_Labwork3.jpeg",
    "/colleges-hero/PNT_labwork4.jpeg",
];

// Fallback Unsplash images used until local photos are uploaded
const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=2669&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581092162384-8987c1d64718?q=80&w=2670&auto=format&fit=crop",
];

export default function HeroRotatingFrames() {
    const [currentIndex, setCurrentIndex] = useState(0);
    // Track which local images failed to load so we can swap to fallback
    const [failedLocal, setFailedLocal] = useState<Record<number, boolean>>({});

    // Build the active images list: use local if it loaded OK, else fallback
    const images = LOCAL_IMAGES.map((src, i) =>
        failedLocal[i] ? (FALLBACK_IMAGES[i] ?? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]) : src
    );

    // Auto rotate every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative w-full aspect-square md:aspect-video lg:aspect-[4/3] perspective-1000 flex items-center justify-center">
            {/* Decorative Background blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/20 dark:bg-indigo-500/30 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative w-full max-w-[500px] h-[350px] md:h-[450px] perspective-1000">
                <AnimatePresence mode="popLayout">
                    {images.map((img, index) => {
                        let offset = index - currentIndex;
                        if (offset < 0) offset += images.length;

                        const isActive = offset === 0;
                        const isNext = offset === 1;
                        const isThird = offset === 2;

                        if (!isActive && !isNext && !isThird) return null;

                        return (
                            <motion.div
                                key={img}
                                initial={{ opacity: 0, scale: 0.8, x: 200, rotateY: -30, z: -200 }}
                                animate={{
                                    opacity: isActive ? 1 : isNext ? 0.6 : 0.3,
                                    scale: isActive ? 1 : isNext ? 0.9 : 0.8,
                                    x: isActive ? 0 : isNext ? 40 : 80,
                                    y: isActive ? 0 : isNext ? 20 : 40,
                                    z: isActive ? 0 : isNext ? -100 : -200,
                                    rotateY: isActive ? -5 : isNext ? -15 : -25,
                                }}
                                exit={{ opacity: 0, scale: 1.1, x: -200, rotateY: 20, z: 100 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className={`absolute top-0 left-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-800 ${isActive ? 'z-30 cursor-pointer shadow-indigo-500/20' : isNext ? 'z-20' : 'z-10'}`}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <img
                                    src={img}
                                    alt={`College Training Photo ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={() => setFailedLocal(prev => ({ ...prev, [index]: true }))}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />

                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="absolute bottom-6 left-6 right-6 flex justify-between items-end"
                                    >
                                        <div className="flex gap-2.5 flex-wrap">
                                            <div className="px-3 md:px-4 py-1.5 md:py-2 bg-indigo-600/90 backdrop-blur-md rounded-lg text-white font-bold text-xs md:text-sm shadow-lg border border-indigo-500/50">
                                                Hardware Prototyping
                                            </div>
                                            <div className="px-3 md:px-4 py-1.5 md:py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-lg text-slate-900 dark:text-white font-bold text-xs md:text-sm shadow-lg border border-slate-200 dark:border-slate-700">
                                                Industrial Focus
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
