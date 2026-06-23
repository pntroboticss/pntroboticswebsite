"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutSnippet() {
    return (
        <section className="py-24 relative overflow-hidden bg-transparent transition-colors duration-500">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left side: Image/Visual */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-3xl blur-2xl opacity-20 dark:opacity-30 translate-y-4 translate-x-4 pointer-events-none" />
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square md:aspect-[4/3] lg:aspect-auto lg:h-[600px] bg-slate-900">
                            
                            <Image 
                                src="/amr_robot_factory.png" 
                                alt="PNT Robotics Autonomous Mobile Robot (AMR) in factory" 
                                fill
                                className="object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-700"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                            
                            {/* Overlay Card */}
                            <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-xl">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">Innovation First</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Pushing the boundaries of automation</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right side: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-blue-700 bg-blue-100/50 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 mb-8">
                            Who We Are
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 dark:text-white leading-tight">
                            Pioneering the next era of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">industrial automation.</span>
                        </h2>
                        
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                            At PNT Robotics, we believe that the future belongs to those who automate. We specialize in designing and manufacturing highly customized robotic platforms and specialized mechanisms that solve complex industrial challenges.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                "In-house R&D and manufacturing capabilities.",
                                "Tailored solutions for unique industrial environments.",
                                "Commitment to exceptional quality and reliability."
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <Link 
                            href="/about"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-white/20 transition-all group"
                        >
                            Read Our Story
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
