"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, Cpu, Zap, Users, Star } from "lucide-react";
import dynamic from "next/dynamic";

const InteractiveTerminal = dynamic(() => import("./InteractiveTerminal"), { ssr: false });

export default function CoursesForKidsHero() {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    return (
        <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-24 flex flex-col justify-center overflow-hidden min-h-[90vh]">
            {/* Subtle color tint — NetworkBackground comes from root layout */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5 dark:from-blue-600/10 dark:to-indigo-600/10 pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10 grid gap-8 md:gap-12 items-center lg:grid-cols-2">

                {/* ─── Left Content ─── */}
                <div className="max-w-2xl z-20 order-first">
                    {/* Robotics Championship Promotional Ribbon */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="pointer-events-auto w-fit mb-6"
                    >
                        <Link
                            href="/championship/individual"
                            className="inline-flex items-center gap-3 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-bold text-sm md:text-base text-white border border-blue-400/40 shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_35px_rgba(99,102,241,0.55)] transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                            style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 60%, #7c3aed 100%)' }}
                        >
                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                            <span className="relative flex h-3 w-3 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-300" />
                            </span>
                            <span className="text-lg leading-none">🏆</span>
                            <span className="font-black tracking-wide">Robotics Championship {currentYear}-{nextYear} — Register Now!</span>
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 border border-white/30 text-xs group-hover:translate-x-1 transition-transform shrink-0">
                                →
                            </span>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur border-slate-200 dark:border-slate-700"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            Grades 4 to 12
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="font-black leading-[1.1] tracking-tight mb-6 sm:mb-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-slate-900 dark:text-white"
                    >
                        Unleash the Innovator Within:{" "}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            Robotics &amp; AI
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="leading-relaxed mb-8 sm:mb-10 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400"
                    >
                        Turn screen time into a springboard for the future. From crafting their first lines of code to wiring intelligent robots and training AI models, we empower the next generation of creators, thinkers, and tech pioneers.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                    >
                        <Link
                            href="#programs"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-base sm:text-lg shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all"
                        >
                            Explore Programs <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold text-base sm:text-lg hover:bg-white dark:hover:bg-slate-800 hover:-translate-y-1 transition-all shadow-sm backdrop-blur"
                        >
                            Talk to an Advisor
                        </Link>
                    </motion.div>

                    {/* Mobile quick-stats — visible ONLY on small screens instead of 3D model */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="grid grid-cols-2 gap-3 mt-8 lg:hidden"
                    >
                        {[
                            { icon: <Cpu className="w-5 h-5 text-blue-500" />, label: "15 Projects", sub: "Hands-on builds" },
                            { icon: <Zap className="w-5 h-5 text-indigo-500" />, label: "2 Levels", sub: "Basic & Advanced" },
                            { icon: <Users className="w-5 h-5 text-violet-500" />, label: "10,000+", sub: "Students trained" },
                            { icon: <Star className="w-5 h-5 text-amber-500" />, label: "Grades 4–12", sub: "All age groups" },
                        ].map((stat) => (
                            <div key={stat.label} className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur border border-white/40 dark:border-slate-700/50 shadow-sm">
                                <div className="shrink-0 mt-0.5">{stat.icon}</div>
                                <div>
                                    <div className="font-black text-sm text-slate-900 dark:text-white">{stat.label}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{stat.sub}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* ─── Right: 3D Canvas / Mobile OS Button ─── */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative w-full flex items-center justify-center h-[200px] sm:h-[400px] lg:h-[600px] mt-8 lg:mt-0 overflow-visible"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-indigo-900/10 to-transparent rounded-[3rem] blur-[60px] lg:blur-3xl -z-10 animate-pulse" />
                    <div className="absolute inset-0 z-10 w-full h-full overflow-visible">
                        <InteractiveTerminal />
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indication */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 pointer-events-none"
            >
                <span className="text-[10px] uppercase tracking-widest font-bold">Scroll to Explore</span>
                <ChevronDown className="w-5 h-5 animate-bounce" />
            </motion.div>
        </section>
    );
}
