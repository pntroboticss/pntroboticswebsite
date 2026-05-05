"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProgramsTabs() {
    const [activeTab, setActiveTab] = useState<"students" | "schools">("students");

    return (
        <div>
            {/* Tab Toggles */}
            <div className="flex justify-center flex-wrap gap-4 mb-16">
                <button
                    onClick={() => setActiveTab("students")}
                    className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 text-lg ${activeTab === "students" ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"}`}
                >
                    For Students
                </button>
                <button
                    onClick={() => setActiveTab("schools")}
                    className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 text-lg ${activeTab === "schools" ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"}`}
                >
                    For Schools
                </button>
            </div>

            {/* Animated Tab Content Container */}
            <div className="max-w-4xl mx-auto min-h-[450px]">
                <AnimatePresence mode="wait">
                    {activeTab === "students" ? (
                        <motion.div
                            key="students"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="p-8 md:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-blue-500/20 shadow-xl transition-colors duration-500"
                        >
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-600/20 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-500">
                                <span className="text-3xl">🚀</span>
                            </div>
                            <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white transition-colors duration-500">Student Programs (4th-12th)</h3>
                            <p className="text-blue-600 dark:text-blue-400 font-medium mb-6 text-lg transition-colors duration-500">Hands-on Robotics & AI Bootcamps</p>
                            <p className="text-slate-800 dark:text-slate-300 mb-8 leading-relaxed text-lg transition-colors duration-500">
                                Dive hands-first into the world of robotics. Build real machines, code microcontrollers, and learn the physics of flight.
                            </p>

                            {/* Cards Grid replacing list */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                                    <span className="text-2xl">🎓</span>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Courses for Kids</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Tailored 4th-12th grade learning.</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                                    <span className="text-2xl">💻</span>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Live Online Classes</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Learn from anywhere, anytime.</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                                    <span className="text-2xl">⚓</span>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Elite Internships</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Indian Army & Navy projects.</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                                    <span className="text-2xl">🤖</span>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">AI & Robotics</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Master the technologies of tomorrow.</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4 md:col-span-2">
                                    <span className="text-2xl">👨‍👩‍👧</span>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Options for Students & Parents</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Flexible weekend workshops and parent-child bootcamps.</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold transition-all text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-1">
                                Enroll as a Student Now
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="schools"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="p-8 md:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-purple-500/20 shadow-xl transition-colors duration-500"
                        >
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-600/20 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-500">
                                <span className="text-3xl">🏫</span>
                            </div>
                            <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white transition-colors duration-500">School Partnerships</h3>
                            <p className="text-purple-600 dark:text-purple-400 font-medium mb-6 text-lg transition-colors duration-500">Bring the Future to Your Classrooms</p>
                            <p className="text-slate-800 dark:text-slate-300 mb-8 leading-relaxed text-lg transition-colors duration-500">
                                Equip your school with practical robotics kits, comprehensive curriculum, and educator training to confidently teach modern technologies.
                            </p>

                            {/* Cards Grid replacing list */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                                    <span className="text-2xl">🏫</span>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Lab for Schools</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Robotics & Composite Skills.</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                                    <span className="text-2xl">🎓</span>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Courses for Kids</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Online & Offline Bootcamps.</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                                    <span className="text-2xl">🏆</span>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Championship</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">National Level Competitions.</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                                    <span className="text-2xl">🛠️</span>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Workshop</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Hands-on practical training.</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                                    <span className="text-2xl">📦</span>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Kit</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Proprietary educational hardware.</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                                    <span className="text-2xl">🏕️</span>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Summer Camp & Internship</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Army/Navy projects & fun learning.</p>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                                    <span className="text-2xl">📚</span>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Curriculum</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">NEP, CBSE, ICSE, IB aligned.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="flex-1 py-5 rounded-xl border-2 border-purple-500/30 text-purple-600 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-600/20 font-semibold transition-all text-lg shadow-lg">
                                    Request Partnership Guide
                                </button>
                                <button className="flex-1 py-5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold transition-all text-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:-translate-y-1">
                                    Book Free Demo Bootcamp
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
