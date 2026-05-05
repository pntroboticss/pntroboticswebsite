"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
    const [exit, setExit] = useState(false);

    useEffect(() => {
        // Hold for 1.6s then begin the blend-out
        const t1 = setTimeout(() => setExit(true), 1600);
        // After blend-out (0.9s), signal done
        const t2 = setTimeout(() => onComplete(), 2500);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!exit ? (
                <motion.div
                    key="intro-in"
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Ambient glow - same colour as the site's network background nodes */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-purple-600/10 blur-[80px]" />
                    </div>

                    {/* Grid lines — adaptive to light/dark mode */}
                    <div className="absolute inset-0 pointer-events-none opacity-30 dark:hidden"
                        style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
                            backgroundSize: "60px 60px",
                        }}
                    />
                    <div className="absolute inset-0 pointer-events-none opacity-30 hidden dark:block"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
                            backgroundSize: "60px 60px",
                        }}
                    />

                    {/* Corner brackets */}
                    {[
                        "top-5 left-5 border-t-2 border-l-2",
                        "top-5 right-5 border-t-2 border-r-2",
                        "bottom-5 left-5 border-b-2 border-l-2",
                        "bottom-5 right-5 border-b-2 border-r-2",
                    ].map((cls, i) => (
                        <motion.div
                            key={i}
                            className={`absolute w-7 h-7 border-blue-500/60 ${cls}`}
                            initial={{ opacity: 0, scale: 0.4 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + i * 0.06, duration: 0.35, ease: "easeOut" }}
                        />
                    ))}

                    {/* Main logotype */}
                    <div className="relative z-10 text-center select-none">
                        {/* P N T — each letter clips up from below */}
                        <div className="flex items-end justify-center gap-4 md:gap-6 mb-5 overflow-hidden pb-2">
                            {["P", "N", "T"].map((letter, i) => (
                                <motion.span
                                    key={letter}
                                    className="text-[80px] md:text-[120px] font-black text-slate-900 dark:text-white leading-none tracking-widest"
                                    style={{ textShadow: "0 0 60px rgba(99,102,241,0.4)" }}
                                    initial={{ y: "110%", opacity: 0 }}
                                    animate={{ y: "0%", opacity: 1 }}
                                    transition={{
                                        delay: 0.15 + i * 0.12,
                                        duration: 0.55,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </div>

                        {/* "Academy" rule line */}
                        <motion.div
                            className="flex items-center gap-4"
                            initial={{ opacity: 0, scaleX: 0.3 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ delay: 0.65, duration: 0.5, ease: "easeOut" }}
                        >
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-blue-500" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-blue-400">
                                Robotics
                            </span>
                            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-blue-500/60 to-blue-500" />
                        </motion.div>

                        {/* Tagline */}
                        <motion.p
                            className="text-slate-500 text-[10px] tracking-[0.35em] uppercase mt-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.0, duration: 0.5 }}
                        >
                            Robotics &middot; AI &middot; Innovation
                        </motion.p>
                    </div>

                    {/* Loading bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-200 dark:bg-slate-800/80">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.5, ease: "linear" }}
                        />
                    </div>
                </motion.div>
            ) : (
                /* Blend-out: fade to the site's exact background colour, then vanish */
                <motion.div
                    key="intro-out"
                    className="fixed inset-0 z-[9999] bg-slate-50 dark:bg-slate-950"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                />
            )}
        </AnimatePresence>
    );
}
