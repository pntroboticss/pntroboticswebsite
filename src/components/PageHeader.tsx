"use client";
import { motion } from "framer-motion";
import NetworkBackground from "./NetworkBackground";
import ClientOnly from "./ClientOnly";

interface PageHeaderProps {
    title: string;
    subtitle: string;
    description: string;
    actionText?: string;
    actionLink?: string;
    colorFrom: string;
    colorTo: string;
}

export default function PageHeader({ title, subtitle, description, actionText, actionLink, colorFrom, colorTo }: PageHeaderProps) {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden min-h-[50vh] flex flex-col justify-center">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0">
                <ClientOnly>
                    <NetworkBackground />
                </ClientOnly>
            </div>

            {/* Gradient Overlays for Readability */}
            <div className={`absolute inset-0 bg-gradient-to-b from-slate-50/80 to-slate-100 dark:from-slate-900/80 dark:to-slate-950 z-0`}></div>
            <div className={`absolute inset-0 bg-gradient-to-r ${colorFrom} ${colorTo} opacity-5 dark:opacity-10 z-0`}></div>

            <div className="container mx-auto px-4 z-10 relative">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className={`inline-block px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 mb-6`}
                    >
                        <span className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${colorFrom} ${colorTo}`}>
                            {subtitle}
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-8"
                    >
                        {title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mb-10"
                    >
                        {description}
                    </motion.p>

                    {actionText && actionLink && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <a
                                href={actionLink}
                                className={`px-8 py-4 rounded-full font-bold text-white shadow-lg transition-transform hover:scale-105 bg-gradient-to-r ${colorFrom} ${colorTo}`}
                            >
                                {actionText}
                            </a>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
