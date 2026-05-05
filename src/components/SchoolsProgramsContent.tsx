"use client";

import { motion } from "framer-motion";
import { Wrench, BookOpen, ShieldCheck, Zap, ArrowRight, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const PROGRAMS = [
    {
        id: "workshop",
        title: "2 Days Training Program",
        description: "Conducted right at your school campus. Students work in groups of 5 with Take-away Kits. We cover the fundamentals of Robotics, Coding, and Science in an intensive, fun format.",
        icon: Wrench,
        color: "from-blue-500 to-cyan-500",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-800"
    },
    {
        id: "curriculum",
        title: "1-Year STEM Robotics Curriculum",
        description: "A comprehensive Project-Based Teaching Methodology. We strictly bridge the gap between theoretical classroom learning and real-world industrial demands. NEP 2020 aligned.",
        icon: BookOpen,
        color: "from-purple-500 to-fuchsia-500",
        bg: "bg-purple-50 dark:bg-purple-900/20",
        border: "border-purple-200 dark:border-purple-800"
    },
    {
        id: "kavach",
        title: "Indian Navy 'Kavach' Internship",
        description: "An exclusive 1-month guided online internship for schools. Students get the rare opportunity to solve real-world defense challenges and understand military-grade tech.",
        icon: ShieldCheck,
        color: "from-emerald-500 to-teal-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        border: "border-emerald-200 dark:border-emerald-800"
    }
];

export default function SchoolsProgramsContent() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Prestige Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex justify-center mb-20"
                >
                    <div className="inline-flex items-center gap-4 px-6 md:px-8 py-4 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40 border border-amber-300 dark:border-amber-700/50 rounded-full shadow-xl">
                        <Award className="w-8 h-8 md:w-10 md:h-10 text-amber-600 dark:text-amber-400" />
                        <div>
                            <p className="font-black text-amber-900 dark:text-amber-200 text-sm md:text-base leading-tight">
                                Appreciated by Hon'ble PM Shri Narendra Modi
                            </p>
                            <p className="font-bold text-amber-700 dark:text-amber-400/80 text-xs md:text-sm">
                                Featured on Shark Tank India (Funded by Peyush Bansal)
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Staggered Content Sections */}
                <div className="space-y-16 md:space-y-32">
                    {PROGRAMS.map((prog, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <motion.div
                                key={prog.id}
                                id={prog.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
                                className={`flex flex-col md:flex-row gap-8 lg:gap-16 items-center ${isEven ? "" : "md:flex-row-reverse"}`}
                            >
                                {/* Graphic Side */}
                                <div className="w-full md:w-1/2">
                                    <div className={`aspect-square md:aspect-[4/3] rounded-[2.5rem] ${prog.bg} border ${prog.border} flex items-center justify-center p-12 relative overflow-hidden group shadow-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]`}>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${prog.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring" }}
                                            className={`w-32 h-32 md:w-48 md:h-48 rounded-[2rem] bg-gradient-to-br ${prog.color} flex items-center justify-center shadow-lg relative z-10`}
                                        >
                                            <prog.icon className="w-16 h-16 md:w-24 md:h-24 text-white drop-shadow-md" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Text Side */}
                                <div className="w-full md:w-1/2 space-y-6">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                                        {prog.title}
                                    </h2>
                                    <div className={`w-20 h-1.5 rounded-full bg-gradient-to-r ${prog.color}`} />
                                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {prog.description}
                                    </p>
                                    <div className="pt-4">
                                        <button className={`group inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-md hover:shadow-xl transition-all hover:-translate-y-1 bg-white dark:bg-slate-900 border ${prog.border}`}>
                                            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${prog.color}`}>
                                                Learn More
                                            </span>
                                            <ArrowRight className="w-4 h-4 text-slate-900 dark:text-white group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Free AI & Robotics Bootcamp (Prominent CTA) */}
                <motion.div
                    id="bootcamp"
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-32 relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-950 p-10 md:p-16 lg:p-20 text-center shadow-2xl border border-blue-500/30"
                >
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold text-sm tracking-widest uppercase rounded-full mb-8 shadow-lg transform -rotate-2">
                            <Zap className="w-4 h-4" /> Power Learning
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-md">
                            Free AI & Robotics Bootcamp
                        </h2>

                        <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
                            <span className="font-bold text-white">5 Days. Zero Cost.</span> Learn the extreme basics of AI and discover exactly how robots "think". Complete the bootcamp and earn digital certificates for your students.
                        </p>

                        <Link
                            href="/programs/schools/bootcamp-register"
                            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-900 font-black text-xl md:text-2xl rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,165,0,0.4)]"
                        >
                            <span className="relative z-10">Register Your School For Free</span>
                            <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white via-orange-100 to-white group-hover:bg-gradient-to-r group-hover:from-orange-100 group-hover:via-white group-hover:to-orange-100 transition-all"></div>
                        </Link>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
