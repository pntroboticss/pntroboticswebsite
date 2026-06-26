"use client";

import { CheckCircle2, Award, Tv, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const SPECIALTIES = [
    "Artificial Intelligence (AI)", "Robotics", "Machine Learning", 
    "Internet of Things (IoT)", "Human-Computer Interaction", 
    "Software Development", "Sensor Fusion", "Autonomous Navigation", 
    "Data Science & Analytics", "Robotic Arm & AGV's"
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function CompanyOverview() {
    return (
        <section id="about" className="relative w-full py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
            
            {/* Ambient Glowing Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[150px] pointer-events-none translate-y-1/3 -translate-x-1/3" />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
                >
                    
                    {/* Left Side: Text Overview */}
                    <div className="flex flex-col">
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-cyan-700 bg-cyan-100/50 dark:bg-cyan-900/30 dark:text-cyan-300 border border-cyan-200/50 dark:border-cyan-800/50 mb-8 w-max">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                            About Us & Achievements
                        </motion.div>
                        
                        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6">
                            Recognized Leaders in <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400">Robotics & Automation.</span>
                        </motion.h2>
                        
                        <motion.div variants={itemVariants} className="mb-10">
                            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-6 leading-relaxed font-light">
                                We, at <span className="font-semibold text-cyan-600 dark:text-cyan-400">PNT Robotics and Automation Solutions</span>, are proud to be recognized as a leading startup in the Robotics and Automation industry, prominently featured among <strong className="text-slate-900 dark:text-white">Maharashtra's Top 100 Startups</strong>.
                            </p>

                            <div className="space-y-4 border-l-4 border-cyan-500/50 pl-6 py-2">
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Our journey includes significant milestones, such as showcasing our innovative products on the esteemed platform of <strong className="text-slate-900 dark:text-white">SHARK TANK INDIA</strong>, where we stood out among 65,000 entries and secured funding from Lenskart.
                                </p>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Additionally, we hold memberships in the <strong className="text-slate-900 dark:text-white">Government e-Marketplace (GeM)</strong> and the Central Public Procurement Portal of the Government of India (CPPP), underlining our commitment to excellence and compliance with regulatory standards.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="mb-10">
                            <h4 className="text-slate-900 dark:text-white font-bold mb-5 text-lg">Our Core Specialties</h4>
                            <div className="flex flex-wrap gap-2.5">
                                {SPECIALTIES.map((spec, idx) => (
                                    <motion.span 
                                        key={spec} 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 + (idx * 0.05) }}
                                        viewport={{ once: true }}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200/50 dark:border-slate-700/50 hover:border-cyan-500/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all cursor-default"
                                    >
                                        <CheckCircle2 size={14} className="text-cyan-500" />
                                        {spec}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Photo Collage */}
                    <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center mt-10 lg:mt-0">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
                        
                        {/* Photo 1 (Main/Top Left) */}
                        <motion.div 
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, zIndex: 30 }}
                            className="absolute top-0 left-0 w-[60%] h-[70%] rounded-3xl overflow-hidden shadow-2xl z-20 border border-white/20"
                        >
                            <Image src="/images/humanoid-robot-lab.png" alt="Humanoid Robot Lab" fill className="object-cover" />
                        </motion.div>

                        {/* Photo 2 (Top Right Accent) */}
                        <motion.div 
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, zIndex: 30 }}
                            className="absolute top-10 right-0 w-[45%] h-[45%] rounded-3xl overflow-hidden shadow-xl z-10 border border-white/20"
                        >
                            <Image src="/images/slider/robobuild2.jpg" alt="Building Robot" fill className="object-cover" />
                        </motion.div>

                        {/* Photo 3 (Bottom Right Overlap) */}
                        <motion.div 
                            variants={itemVariants}
                            whileHover={{ scale: 1.05, zIndex: 30 }}
                            className="absolute bottom-0 right-10 w-[55%] h-[45%] rounded-3xl overflow-hidden shadow-2xl z-30 border border-white/20"
                        >
                            <Image src="/images/slider/agv.jpeg" alt="AGV Robot" fill className="object-cover" />
                        </motion.div>

                        {/* Shark Tank Floating Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -left-6 top-1/2 -translate-y-1/2 z-40 bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2"
                        >
                            <div className="relative h-10 w-24">
                                <Image src="/images/shark-tank-logo.png" alt="Shark Tank" fill className="object-contain" />
                            </div>
                            <span className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">Funded Startup</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
