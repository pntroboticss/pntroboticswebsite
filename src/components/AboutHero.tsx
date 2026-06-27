"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutHero() {
    return (
        <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image 
                    src="/images/slider/robobuild2.jpg" 
                    alt="PNT Robotics Lab" 
                    fill 
                    priority
                    className="object-cover"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-50 dark:to-slate-950" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-black/50 backdrop-blur-md mb-6 shadow-xl">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-sm font-bold tracking-widest uppercase text-cyan-300">
                            Our Story
                        </span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight drop-shadow-2xl">
                        Pioneering the Future of <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Autonomous Robotics</span>
                    </h1>
                    
                    <p className="text-lg md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-lg">
                        We build robust, scalable, and intelligent robotic platforms to solve real-world industrial challenges and redefine automation.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
