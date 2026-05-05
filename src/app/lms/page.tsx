"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import NetworkBackground from "@/components/NetworkBackground";
import Navbar from "@/components/Navbar";

export default function LMSPage() {
    return (
        <main className="min-h-screen relative text-slate-900 dark:text-slate-50 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            <NetworkBackground />
            <Navbar />

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">

                {/* Floating 3D/Emoji Animation */}
                <motion.div
                    animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="text-8xl md:text-9xl mb-8 filter drop-shadow-2xl"
                >
                    🎓
                </motion.div>

                {/* Main Heading Text */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500"
                >
                    Coming Soon
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12"
                >
                    We are building an incredible new Learning Management System (LMS) designed for schools, teachers, and students to master the technologies of tomorrow.
                </motion.p>

                {/* Action Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                >
                    <Link
                        href="/"
                        className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 inline-flex items-center gap-2"
                    >
                        <span>←</span> Return Home
                    </Link>
                </motion.div>

                {/* Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
            </div>
        </main>
    );
}
