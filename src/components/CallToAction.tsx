"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function CallToAction() {
    return (
        <section className="py-24 relative overflow-hidden bg-transparent transition-colors duration-500">
            <div className="container mx-auto px-4 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
                    className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-[3rem] p-10 md:p-16 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20"
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none mix-blend-overlay" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-400/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none mix-blend-overlay" />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20 mb-8 shadow-inner">
                            <MessageSquare className="w-10 h-10 text-white" />
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white tracking-tight leading-tight max-w-3xl">
                            Ready to Automate Your Future?
                        </h2>
                        
                        <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Let's discuss how our custom robotic platforms and automation systems can revolutionize your operational efficiency.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto mb-12">
                            <Link 
                                href="/contact"
                                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-xl"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get in Touch
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </div>

                        {/* Contact Information Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left bg-white/10 dark:bg-black/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                            <div className="flex flex-col">
                                <span className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-1">Call Us</span>
                                <a href="tel:7977543839" className="text-white font-medium hover:text-blue-200 transition-colors">7977543839</a>
                                <a href="tel:7977832907" className="text-white font-medium hover:text-blue-200 transition-colors">7977832907</a>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-1">Email Us</span>
                                <a href="mailto:contact@pntsolutions.in" className="text-white font-medium hover:text-blue-200 transition-colors">contact@pntsolutions.in</a>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-1">Visit Us</span>
                                <span className="text-white font-medium text-sm leading-snug">Plot no. A115, Infinity Business Park, <br/>MIDC, Dombivli East, Kalyan, <br/>Maharashtra 421203</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
