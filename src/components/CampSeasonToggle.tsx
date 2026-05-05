"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Snowflake, Calendar, Users, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

// ─── Snow Particle (CSS-driven) ─────────────────────────────────────
function SnowParticles() {
    const flakes = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${3 + Math.random() * 4}s`,
        size: `${3 + Math.random() * 5}px`,
        opacity: 0.15 + Math.random() * 0.35,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {flakes.map((f) => (
                <div
                    key={f.id}
                    className="absolute rounded-full bg-white/80 dark:bg-slate-300/50 animate-snowfall"
                    style={{
                        left: f.left,
                        width: f.size,
                        height: f.size,
                        opacity: f.opacity,
                        animationDelay: f.delay,
                        animationDuration: f.duration,
                    }}
                />
            ))}
        </div>
    );
}

// ─── Heat Shimmer (CSS-driven) ──────────────────────────────────────
function HeatShimmer() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Floating sun rays — very subtle in dark mode */}
            <div className="absolute top-4 right-8 w-32 h-32 bg-yellow-300/20 dark:bg-amber-700/10 rounded-full blur-[80px] animate-pulse" />
            <div className="absolute top-12 right-20 w-20 h-20 bg-orange-300/15 dark:bg-orange-800/8 rounded-full blur-[50px] animate-bounce-slow" />
            {/* Very subtle warm glow along bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-400/3 dark:from-amber-900/5 to-transparent animate-heat-shimmer" />
        </div>
    );
}

// ─── Camp Content Data ──────────────────────────────────────────────
const SUMMER_DATA = {
    title: "Summer Camp",
    tagline: "5 Days of Pure Creation",
    description: "Step away from screens and build real robots! Our summer camps are purely hands-on — students build line-followers, code games, and fly drones.",
    highlights: ["Python & Block Coding", "Line Follower Robots", "Drone Dynamics", "AI Game Design"],
    ages: "Ages 8–15",
    seats: "Limited to 15 Seats per Batch",
    cta: "Join the Summer Waitlist",
};

const WINTER_DATA = {
    title: "Winter Camp",
    tagline: "Build Cool Things in the Cold",
    description: "Holiday coding and robotics bootcamp. Students dive into IoT projects, advanced Python, and competitive robot building during winter break.",
    highlights: ["IoT Smart Home Projects", "Advanced Arduino", "Robot Wars Challenge", "3D Printing Basics"],
    ages: "Ages 10–16",
    seats: "Limited to 12 Seats per Batch",
    cta: "Join the Winter Waitlist",
};

// ─── Main Component ─────────────────────────────────────────────────
export default function CampSeasonToggle() {
    const [season, setSeason] = useState<"summer" | "winter">("summer");
    const data = season === "summer" ? SUMMER_DATA : WINTER_DATA;

    const isSummer = season === "summer";

    return (
        <section className="relative py-20">
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                    Seasonal Camps
                </h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                    Intensive holiday bootcamps that transform vacation time into innovation time.
                </p>
            </div>

            {/* ─── Glassmorphism Toggle Button ─────────────────────── */}
            <div className="flex justify-center mb-12">
                <div className="relative p-1.5 rounded-2xl bg-white/40 dark:bg-white/10 backdrop-blur-xl border border-white/50 dark:border-white/20 shadow-xl">
                    <div className="flex gap-1">
                        <button
                            onClick={() => setSeason("summer")}
                            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-500 ${
                                isSummer
                                    ? "text-orange-900 dark:text-orange-100"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                        >
                            {isSummer && (
                                <motion.div
                                    layoutId="campToggle"
                                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-200/70 to-orange-200/70 dark:from-amber-600/40 dark:to-orange-600/40 backdrop-blur-sm shadow-lg border border-orange-300/40 dark:border-amber-500/50"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Sun className="w-4 h-4 relative z-10" />
                            <span className="relative z-10">Summer Camp</span>
                        </button>

                        <button
                            onClick={() => setSeason("winter")}
                            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-500 ${
                                !isSummer
                                    ? "text-blue-900 dark:text-blue-100"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                        >
                            {!isSummer && (
                                <motion.div
                                    layoutId="campToggle"
                                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-200/70 to-sky-200/70 dark:from-blue-600/40 dark:to-sky-600/40 backdrop-blur-sm shadow-lg border border-blue-300/40 dark:border-blue-500/50"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Snowflake className="w-4 h-4 relative z-10" />
                            <span className="relative z-10">Winter Camp</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Main Card with Weather Effects ─────────────────── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={season}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className={`relative overflow-hidden rounded-[3rem] p-8 md:p-14 border shadow-2xl transition-colors duration-700 ${
                        isSummer
                            ? "bg-gradient-to-br from-amber-50 via-orange-50/80 to-yellow-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-orange-200/40 dark:border-amber-900/30"
                            : "bg-gradient-to-br from-blue-50 via-sky-50/80 to-indigo-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-blue-200/40 dark:border-blue-900/30"
                    }`}
                >
                    {/* Weather Effects */}
                    {isSummer ? <HeatShimmer /> : <SnowParticles />}

                    {/* Content Grid */}
                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Info */}
                        <div className="space-y-6">
                            <span
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest border ${
                                    isSummer
                                        ? "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20"
                                        : "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                                }`}
                            >
                                {isSummer ? <Sun className="w-4 h-4" /> : <Snowflake className="w-4 h-4" />}
                                {data.tagline}
                            </span>

                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                                {data.title}
                            </h3>

                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                {data.description}
                            </p>

                            <div className="grid sm:grid-cols-2 gap-3">
                                {data.highlights.map((item, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center gap-3 p-3 rounded-xl border backdrop-blur-sm ${
                                            isSummer
                                                ? "bg-white/60 dark:bg-white/5 border-orange-100 dark:border-orange-800/30"
                                                : "bg-white/60 dark:bg-white/5 border-blue-100 dark:border-blue-800/30"
                                        }`}
                                    >
                                        <Zap className={`w-4 h-4 shrink-0 ${isSummer ? "text-orange-500" : "text-blue-500"}`} />
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/contact"
                                className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all text-white ${
                                    isSummer
                                        ? "bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-orange-500/25"
                                        : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-blue-500/25"
                                }`}
                            >
                                {data.cta} <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Right: Stats Card with Glassmorphism */}
                        <div className="flex justify-center">
                            <div
                                className={`relative p-10 rounded-[2rem] border shadow-2xl backdrop-blur-xl max-w-sm w-full text-center ${
                                    isSummer
                                        ? "bg-white/30 dark:bg-white/5 border-white/50 dark:border-orange-500/20"
                                        : "bg-white/30 dark:bg-white/5 border-white/50 dark:border-blue-500/20"
                                }`}
                            >
                                <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
                                    isSummer
                                        ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/20 dark:shadow-amber-900/20"
                                        : "bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20"
                                }`}>
                                    {isSummer ? (
                                        <Sun className="w-10 h-10 text-white drop-shadow-md" />
                                    ) : (
                                        <Snowflake className="w-10 h-10 text-white drop-shadow-md" />
                                    )}
                                </div>

                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Users className={`w-5 h-5 ${isSummer ? "text-orange-500" : "text-blue-500"}`} />
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                                        {data.ages}
                                    </h4>
                                </div>

                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    Groups split by age for comfortable peer-learning.
                                </p>

                                <div className="flex items-center justify-center gap-2">
                                    <Calendar className={`w-4 h-4 ${isSummer ? "text-orange-500" : "text-blue-500"}`} />
                                    <span
                                        className={`py-1.5 px-5 rounded-full text-sm font-bold ${
                                            isSummer
                                                ? "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400"
                                                : "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                                        }`}
                                    >
                                        {data.seats}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </section>
    );
}
