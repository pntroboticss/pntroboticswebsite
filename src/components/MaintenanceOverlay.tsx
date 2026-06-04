"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Construction, X } from "lucide-react";

export default function MaintenanceOverlay() {
    const [isVisible, setIsVisible] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // We no longer hide the body scrollbar because it's a popup, not a full screen block.
    }, []);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden"
                    >
                        {/* Yellow and Black warning stripes top */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-[repeating-linear-gradient(45deg,#fbbf24,#fbbf24_10px,#0f172a_10px,#0f172a_20px)]" />

                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col items-center text-center p-8 pt-10">
                            <button 
                                onClick={() => setIsVisible(false)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-6 border border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                                <Construction className="w-8 h-8 text-yellow-500" />
                            </div>

                            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wide">
                                Site Under <span className="text-yellow-500">Maintenance</span>
                            </h2>

                            <p className="text-slate-300 mb-6 leading-relaxed">
                                We are currently engineering our new platform. Some features are fully functional, while others are still under construction.
                            </p>

                            <button
                                onClick={() => setIsVisible(false)}
                                className="w-full py-3 bg-yellow-500 text-slate-950 font-bold uppercase tracking-wider rounded-xl hover:bg-yellow-400 transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
