"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation, Activity, Settings, RadioTower, Hand, Building2, Download, ArrowRight, Zap, GraduationCap, User } from "lucide-react";
import Link from "next/link";

const OFFERINGS = [
    {
        id: "agv",
        title: "5-Days AGV Training",
        badge: "Basic & Advance",
        description: "Master the mechanics, navigation algorithms, and control systems of Automated Guided Vehicles.",
        icon: Navigation,
        color: "from-blue-500 to-indigo-600",
        delay: 0.1
    },
    {
        id: "arm",
        title: "Robotics Arm",
        badge: "Basic & Advance",
        description: "Kinematics, trajectory planning, and programming of multi-axis industrial robotic arms.",
        icon: Activity,
        color: "from-purple-500 to-pink-600",
        delay: 0.2
    },
    {
        id: "ros",
        title: "ROS (Robot Operating System)",
        badge: "Basic & Advance",
        description: "Deep dive into the industry-standard middleware. Learn nodes, topics, services, and SLAM.",
        icon: Settings,
        color: "from-emerald-500 to-teal-600",
        delay: 0.3
    },
    {
        id: "drone",
        title: "Drone Training Workshop",
        badge: "Flight & Build",
        description: "UAV assembly, flight controller tuning, and intelligent autonomous flying.",
        icon: RadioTower,
        color: "from-sky-500 to-blue-600",
        isDrone: true, // Special flag for the toggle UI
        delay: 0.4
    },
    {
        id: "hand",
        title: "Robotics Hand Training",
        badge: "AI & Mechanics",
        description: "Develop articulated bionic hands using advanced sensors, servos, and AI vision systems.",
        icon: Hand,
        color: "from-rose-500 to-red-600",
        delay: 0.5
    },
    {
        id: "internships",
        title: "Industrial Internships",
        badge: "Tata Power & Defense",
        description: "Work on live projects for Tata Power, DRDO, and the Indian Army to get real-world industrial exposure.",
        icon: Building2,
        color: "from-amber-500 to-orange-600",
        delay: 0.6
    }
];

export default function CollegesProgramsContent() {
    const [droneMode, setDroneMode] = useState<"college" | "individual">("college");

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Intro Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20 max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm tracking-widest uppercase rounded-full mb-6">
                        <Zap className="w-4 h-4 text-blue-500" />
                        Industrial Exposure
                    </div>
                </motion.div>

                {/* Offerings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {OFFERINGS.map((offer) => (
                        <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: offer.delay }}
                            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col relative overflow-hidden"
                        >
                            {/* Card Hover Glow */}
                            <div className={`absolute -inset-20 bg-gradient-to-br ${offer.color} opacity-0 group-hover:opacity-5 blur-3xl transition-opacity duration-500 pointer-events-none`} />

                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${offer.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 relative z-10`}>
                                    <offer.icon className="w-8 h-8 text-white" />
                                </div>
                                <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400`}>
                                    {offer.badge}
                                </span>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-colors duration-300 relative z-10">
                                {offer.title}
                            </h3>

                            <p className="text-slate-600 dark:text-slate-400 flex-grow mb-8 relative z-10">
                                {offer.description}
                            </p>

                            {/* Special Drone Toggle UI */}
                            {offer.isDrone ? (
                                <div className="mt-auto relative z-10 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center mb-4 border border-slate-200 dark:border-slate-700 w-full transition-colors">
                                    <button
                                        onClick={() => setDroneMode("college")}
                                        className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${droneMode === "college" ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                                    >
                                        <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" /> Via College
                                    </button>
                                    <button
                                        onClick={() => setDroneMode("individual")}
                                        className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${droneMode === "individual" ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                                    >
                                        <User className="w-3 h-3 sm:w-4 sm:h-4" /> Individually
                                    </button>
                                </div>
                            ) : null}

                            {/* Action Button */}
                            <div className="mt-auto relative z-10 pt-2 border-t border-slate-100 dark:border-slate-800">
                                {offer.isDrone ? (
                                    <AnimatePresence mode="wait">
                                        <motion.a
                                            key={droneMode}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            href={`#register-drone-${droneMode}`}
                                            className={`inline-flex items-center gap-2 font-bold text-sm transition-colors ${droneMode === "college" ? "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" : "text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"}`}
                                        >
                                            {droneMode === "college" ? "Register Your College" : "Join Individually Now"} <ArrowRight className="w-4 h-4" />
                                        </motion.a>
                                    </AnimatePresence>
                                ) : (
                                    <a href={`#${offer.id}`} className="inline-flex items-center gap-2 font-bold text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        Explore Curriculum <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pitch Deck Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.8 }}
                    className="mt-24 relative overflow-hidden rounded-[3rem] bg-slate-900 border border-slate-800 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl"
                >
                    {/* Background noise texture */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}></div>

                    <div className="absolute -left-32 -top-32 w-64 h-64 bg-blue-600/30 rounded-full blur-[80px]"></div>
                    <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-purple-600/30 rounded-full blur-[80px]"></div>

                    <div className="relative z-10 max-w-xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-slate-300 text-xs font-bold tracking-widest uppercase rounded-full mb-4 border border-white/20">
                            Partnership Guide
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Ready to transform your college lab?
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Download our comprehensive pitch deck to explore the exact setup, hardware specifications, and industrial outcomes for your students.
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0">
                        <button className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_30px_rgba(79,70,229,0.4)]">
                            <span className="relative z-10">Download Pitch Deck</span>
                            <Download className="w-5 h-5 relative z-10 group-hover:translate-y-1 transition-transform" />
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                        <p className="text-slate-500 text-xs text-center mt-3 font-medium">PDF Document • 4.2 MB</p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
