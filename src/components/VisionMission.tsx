"use client";

import { motion } from "framer-motion";
import { Target, Compass } from "lucide-react";

export default function VisionMission() {
    return (
        <section className="relative py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            <div className="absolute left-0 top-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]" />
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                    
                    {/* Vision Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-[2rem] transform group-hover:scale-[1.02] transition-transform duration-500" />
                        <div className="relative p-10 md:p-12 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm h-full flex flex-col">
                            <div className="w-16 h-16 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-8 border border-cyan-200 dark:border-cyan-800">
                                <Compass className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Our Vision</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                                To be the global vanguard of intelligent automation, seamlessly integrating advanced robotics and artificial intelligence to elevate human potential and industrial capabilities beyond traditional limitations.
                            </p>
                        </div>
                    </motion.div>

                    {/* Mission Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-[2rem] transform group-hover:scale-[1.02] transition-transform duration-500" />
                        <div className="relative p-10 md:p-12 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm h-full flex flex-col">
                            <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-8 border border-blue-200 dark:border-blue-800">
                                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Our Mission</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                                To engineer bespoke, cutting-edge hardware and software robotic platforms that solve critical operational challenges for our clients, driving efficiency, safety, and scalable innovation in every project we undertake.
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
