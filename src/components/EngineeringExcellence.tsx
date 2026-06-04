"use client";

import { motion, Variants } from "framer-motion";
import { Cpu, Settings, Wrench, Code2, ArrowRight } from "lucide-react";
import Hover3DWrapper from "@/components/Hover3DWrapper";

const excellenceItems = [
    {
        title: "Autonomous Robotics Platform",
        description: "[Add your detailed description here. This space is reserved for explaining the core capabilities of your automation platform.]",
        icon: Cpu,
        imagePlaceholder: "Photo Placeholder - Platform",
        glowClass: "bg-blue-500/20",
        iconBgClass: "bg-blue-900/40 border-blue-700/50",
        iconTextClass: "text-blue-400",
        hoverBorderClass: "hover:border-blue-500/50",
        hoverTextClass: "hover:text-blue-400"
    },
    {
        title: "Custom Hardware Solutions",
        description: "[Add your detailed description here. Highlight specific customized hardware projects or components you've built.]",
        icon: Wrench,
        imagePlaceholder: "Photo Placeholder - Hardware",
        glowClass: "bg-cyan-500/20",
        iconBgClass: "bg-cyan-900/40 border-cyan-700/50",
        iconTextClass: "text-cyan-400",
        hoverBorderClass: "hover:border-cyan-500/50",
        hoverTextClass: "hover:text-cyan-400"
    },
    {
        title: "Special Purpose Machines",
        description: "[Add your detailed description here. Showcase unique machines designed for specific industrial use-cases.]",
        icon: Settings,
        imagePlaceholder: "Photo Placeholder - Machine",
        glowClass: "bg-indigo-500/20",
        iconBgClass: "bg-indigo-900/40 border-indigo-700/50",
        iconTextClass: "text-indigo-400",
        hoverBorderClass: "hover:border-indigo-500/50",
        hoverTextClass: "hover:text-indigo-400"
    },
    {
        title: "Customized Software Solutions",
        description: "[Add your detailed description here. Explain how you build bespoke software to control, monitor, and optimize your robotic platforms and specialized hardware.]",
        icon: Code2,
        imagePlaceholder: "Photo Placeholder - Software",
        glowClass: "bg-teal-500/20",
        iconBgClass: "bg-teal-900/40 border-teal-700/50",
        iconTextClass: "text-teal-400",
        hoverBorderClass: "hover:border-teal-500/50",
        hoverTextClass: "hover:text-teal-400"
    }
];

export default function EngineeringExcellence() {
    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <section className="py-24 relative bg-transparent transition-colors duration-500">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 dark:bg-cyan-400/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div 
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="max-w-6xl mx-auto"
                >
                    <motion.div variants={fadeInUp} className="text-center mb-16 md:mb-24">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">
                            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">Excellence</span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Delivering state-of-the-art hardware and software solutions tailored to revolutionize industrial automation.
                        </p>
                    </motion.div>

                        <motion.h3 variants={fadeInUp} className="text-2xl md:text-3xl font-bold mb-10 flex items-center gap-3 text-slate-900 dark:text-white">
                            <Cpu className="w-8 h-8 text-blue-500" />
                            Products & Services
                        </motion.h3>

                        <div className="space-y-12">
                            {excellenceItems.map((item, idx) => (
                                <motion.div key={idx} variants={fadeInUp} className="w-full">
                                    <Hover3DWrapper>
                                        <div className="relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-[2rem] p-8 md:p-12 border border-slate-200 dark:border-slate-700/50 shadow-xl overflow-hidden group transition-colors duration-500">
                                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 dark:opacity-20 mix-blend-overlay pointer-events-none" />
                                    <div className={`absolute top-1/2 right-10 w-96 h-96 ${item.glowClass} rounded-full blur-[100px] -translate-y-1/2 pointer-events-none`} />

                                    <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                                        <div className={idx % 2 !== 0 ? 'md:order-2' : ''}>
                                            <div className={`w-14 h-14 rounded-2xl border ${item.iconBgClass} flex items-center justify-center mb-6`}>
                                                <item.icon className={`w-7 h-7 ${item.iconTextClass}`} />
                                            </div>
                                            
                                            <h4 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{item.title}</h4>
                                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                                {item.description}
                                            </p>
                                            <button className={`flex items-center gap-2 font-bold transition-colors group/btn ${item.iconTextClass} ${item.hoverTextClass}`}>
                                                Learn More 
                                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>

                                        {/* Image Placeholder */}
                                        <div className={`w-full h-64 md:h-full min-h-[250px] rounded-2xl bg-slate-100 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 transition-colors backdrop-blur-sm ${idx % 2 !== 0 ? 'md:order-1' : ''} ${item.hoverBorderClass}`}>
                                            <div className="mb-2 text-2xl">📷</div>
                                            <span className="text-sm font-semibold">{item.imagePlaceholder}</span>
                                        </div>
                                    </div>
                                        </div>
                                    </Hover3DWrapper>
                                </motion.div>
                            ))}
                        </div>
                </motion.div>
            </div>
        </section>
    );
}
