"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CustomRoboticsHero() {
    return (
        <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-black transition-colors duration-500">
            {/* Subtle Gradient Background Effect */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
                <div className="w-[800px] h-[800px] bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-cyan-400/20 dark:bg-cyan-500/20 rounded-full blur-[100px]" />
                {/* Subtle futuristic grid overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwaGF0aCBkPSJNMCAwdjQwTTAgMGg0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwaGF0aCBkPSJNMCAwdjQwTTAgMGg0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-20 pointer-events-none" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto">
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">PNT Robotics &</span><br />
                    Automation Solutions LLP.
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="mt-6 text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl font-medium"
                >
                    Making human life simpler & safe with our robotic solutions.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="mt-10 flex flex-col sm:flex-row gap-4"
                >
                    <Link href="#portfolio">
                        <button className="group flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black text-lg font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-xl">
                            Explore Our Robots
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                    <Link href="/contact">
                        <button className="group flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white text-lg font-bold rounded-full hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300">
                            Contact Us
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
