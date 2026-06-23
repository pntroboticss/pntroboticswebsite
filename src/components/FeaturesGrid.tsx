"use client";

import { motion } from "framer-motion";
import { Cpu, Navigation, RadioReceiver, Truck } from "lucide-react";
import Hover3DWrapper from "./Hover3DWrapper";

const features = [
    {
        title: "AMR (Autonomous Mobile Robot)",
        description: "Intelligent, dynamic navigation without physical guides. Our AMRs adapt to obstacles in real-time, making them perfect for complex, ever-changing facility floors.",
        icon: Navigation,
        colSpan: "md:col-span-1 lg:col-span-2",
        colorClass: "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
    },
    {
        title: "AGV (Automated Guided Vehicle)",
        description: "Reliable, high-payload transport following predefined paths. Engineered for extreme efficiency in structured warehouse environments.",
        icon: Truck,
        colSpan: "md:col-span-1 lg:col-span-2",
        colorClass: "from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/10 dark:to-purple-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
    },
    {
        title: "ROV (Remotely Operated Vehicle)",
        description: "Robust platforms for hazardous or hard-to-reach environments. Complete teleoperation with low-latency video feedback and precise manipulation.",
        icon: RadioReceiver,
        colSpan: "md:col-span-1 lg:col-span-2",
        colorClass: "from-rose-500/20 to-pink-500/20 dark:from-rose-500/10 dark:to-pink-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
    },
    {
        title: "SPM (Special Purpose Mechanism)",
        description: "Custom automation rigs designed from scratch to solve your most unique manufacturing challenges. From assembly to testing, we build the machine you need.",
        icon: Cpu,
        colSpan: "md:col-span-1 lg:col-span-2",
        colorClass: "from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/10 dark:to-teal-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
    }
];

export default function FeaturesGrid() {
    return (
        <section className="py-24 relative overflow-hidden bg-transparent transition-colors duration-500">
            {/* Subtle glow */}
            <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 dark:text-white"
                        >
                            Our Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">Platforms</span>
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
                        >
                            Based on our robust 2-wheel differential drive and 4-wheel tracked platforms, we build customized robots tailored to your operational needs.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={feature.colSpan}
                            >
                                <Hover3DWrapper>
                                    <div className={`h-full relative overflow-hidden rounded-[2rem] p-8 bg-gradient-to-br border shadow-lg transition-all duration-300 hover:shadow-xl ${feature.colorClass.split(" ").filter(c => !c.startsWith("text-")).join(" ")} bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm`}>
                                        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                                            <feature.icon className={`w-32 h-32 ${feature.colorClass.split(" ").find(c => c.startsWith("text-") && !c.includes("dark:"))}`} />
                                        </div>
                                        
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white dark:bg-slate-800 shadow-sm border ${feature.colorClass.split(" ").find(c => c.startsWith("border-"))}`}>
                                            <feature.icon className={`w-7 h-7 ${feature.colorClass.split(" ").find(c => c.startsWith("text-") && !c.includes("dark:"))}`} />
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white relative z-10">{feature.title}</h3>
                                        <p className="text-slate-700 dark:text-slate-300 relative z-10 font-medium leading-relaxed">{feature.description}</p>
                                    </div>
                                </Hover3DWrapper>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
