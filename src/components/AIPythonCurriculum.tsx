"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Eye, Target, Brain, Code2, Cpu, Layers, Trophy, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

const OBJECTIVES = [
    { icon: Code2,  color: "text-violet-500 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-900/40", text: "Build a strong Logic Instinct using visual programming." },
    { icon: Cpu,    color: "text-blue-500  dark:text-blue-400",    bg: "bg-blue-100  dark:bg-blue-900/40",    text: "Transition students into professional, text-based Python coding." },
    { icon: Eye,    color: "text-cyan-500  dark:text-cyan-400",    bg: "bg-cyan-100  dark:bg-cyan-900/40",    text: "Provide hands-on experience with Computer Vision and Image Processing." },
    { icon: Brain,  color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "Teach the fundamentals of AI training and Data Classification." },
    { icon: Target, color: "text-rose-500  dark:text-rose-400",    bg: "bg-rose-100  dark:bg-rose-900/40",    text: "Develop interactive AR applications that respond to human gestures and emotions." },
];

const OUTCOMES = [
    { emoji: "🧠", title: "Computational Thinking",   desc: "Ability to break down complex AI problems into solvable steps." },
    { emoji: "🐍", title: "Python Literacy",           desc: "Proficiency in professional text-based coding and libraries (OpenCV, Pygame)." },
    { emoji: "👁️", title: "AI & Computer Vision",      desc: "Understanding how facial recognition and object tracking work in the real world." },
    { emoji: "📊", title: "Data Science Basics",       desc: "Experience in training AI models with custom data sets." },
    { emoji: "🤌", title: "Innovation Skills",         desc: "Ability to design touchless, gesture-controlled software for the future." },
];

interface Day { label: string; desc: string; }
interface Layer {
    id: number;
    badge: string;
    title: string;
    subtitle: string;
    goal: string;
    color: string;
    bgGrad: string;
    borderColor: string;
    days: Day[];
}

const LAYERS: Layer[] = [
    {
        id: 1,
        badge: "Layer 1",
        title: "Scratch-Style Logic",
        subtitle: "Days 1-5",
        goal: "Build foundational logic through visual movement and sensing.",
        color: "text-violet-600 dark:text-violet-400",
        bgGrad: "from-violet-600 to-purple-700",
        borderColor: "border-violet-300 dark:border-violet-700/60",
        days: [
            { label: "Day 1: Make it Move",              desc: "Link physical keys to digital action." },
            { label: "Day 2: Boundary Bounce",           desc: "Teach the computer to recognize limits and edges." },
            { label: "Day 3: The Chase",                 desc: "Create interaction where objects follow or run from the mouse." },
            { label: "Day 4: Score & Trap",              desc: 'Introduce variables and conditional "win/loss" logic.' },
            { label: "Day 5: Layer 1 Boss - The Maze Runner", desc: "Combine all logic into a single complex system." },
        ],
    },
    {
        id: 2,
        badge: "Layer 2",
        title: "Visual Python",
        subtitle: "Days 6-15",
        goal: "Transition to text-based coding using syntax and physics simulations.",
        color: "text-blue-600 dark:text-blue-400",
        bgGrad: "from-blue-600 to-cyan-700",
        borderColor: "border-blue-300 dark:border-blue-700/60",
        days: [
            { label: "Day 6-7: The Digital Pen & Infinite Spin",   desc: "Learn Syntax and For-Loops to create complex art." },
            { label: "Day 8-9: Red Light, Green Light & Bouncing Ball", desc: "Explore Boolean logic and Coordinate Animation." },
            { label: "Day 10-11: Click the Target & Health Bar",   desc: "Master event handling and data visualization." },
            { label: "Day 12-13: Enemy Spawner & Collision Course", desc: "Manage Big Data using lists and geometric logic." },
            { label: "Day 14-15: Layer 2 Boss - Python Dodgeball", desc: "Build a full-scale game using gravity and project management." },
        ],
    },
    {
        id: 3,
        badge: "Layer 3",
        title: "Visual AI & Augmented Reality",
        subtitle: "Days 16-30",
        goal: "Use the webcam as a canvas to build interactive AI-powered filters.",
        color: "text-emerald-600 dark:text-emerald-400",
        bgGrad: "from-emerald-600 to-teal-700",
        borderColor: "border-emerald-300 dark:border-emerald-700/60",
        days: [
            { label: "Day 16: The Digital Eye",            desc: "Connect Python to the camera to process video frames." },
            { label: "Day 17-18: The Face Finder & Crowd Counter", desc: "Learn Object Detection and Data Extraction." },
            { label: "Day 19-20: The Digital Mask & Blink Game", desc: "Analyze 468 facial landmarks and micro-movements." },
            { label: "Day 21: The Nose Painter",           desc: "Use body coordinates as a digital controller for accessibility tech." },
            { label: "Day 22-23: The Clown Filter & Cartoon Face", desc: "Master Image Overlay and Distortion for AR." },
            { label: "Day 24: The Emotion Detector",       desc: "Use behavioral logic to infer feelings from geometry." },
            { label: "Day 25: The AR Button",              desc: "Create a touchless interface using hand-tracking." },
            { label: "Day 26-28: Capstone - The AR Desktop Pet", desc: "Build a pet that wakes up, reacts to smiles, and is fed through AI training." },
            { label: "Day 29-30: Final Capstone - Voice & Intelligence", desc: "Integrate Voice (pyttsx3) to create a fully responsive AI companion." },
        ],
    },
];

// ─── Layer Card ──────────────────────────────────────────────────────────────
function LayerCard({ layer, defaultOpen }: { layer: Layer; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(!!defaultOpen);
    const [activeDayIdx, setActiveDayIdx] = useState<number | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={`rounded-3xl border ${layer.borderColor} overflow-hidden bg-white dark:bg-slate-900/70 shadow-md`}
        >
            {/* ── Tap/Click header ── */}
            <button
                onClick={() => setOpen(v => !v)}
                aria-expanded={open}
                className="w-full flex items-center gap-0 text-left focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 rounded-3xl"
                style={{ minHeight: 72 }}
            >
                <div className={`hidden sm:flex w-3 self-stretch flex-shrink-0 rounded-l-3xl bg-gradient-to-b ${layer.bgGrad}`} />

                <div className="flex flex-1 items-center gap-4 sm:gap-5 px-5 py-5 sm:px-7">
                    <span className={`hidden sm:inline-flex shrink-0 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r ${layer.bgGrad} text-white shadow`}>
                        {layer.badge}
                    </span>

                    <div className="flex-1 min-w-0">
                        <span className={`sm:hidden inline-flex mb-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${layer.bgGrad} text-white`}>
                            {layer.badge}
                        </span>
                        <p className={`text-xl sm:text-2xl font-black ${layer.color} leading-tight`}>{layer.title}</p>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{layer.subtitle}</p>
                    </div>

                    <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">
                        <motion.span
                            animate={{ rotate: open ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="block"
                        >
                            <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </motion.span>
                    </div>
                </div>
            </button>

            {/* ── Expanded content ── */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 sm:px-8 pb-7 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-5 flex items-start gap-2">
                                <span className="shrink-0 mt-0.5">🎯</span>
                                <span><span className="font-black text-slate-700 dark:text-slate-300">Goal: </span>{layer.goal}</span>
                            </p>

                            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3">
                                {layer.days.map((day, i) => {
                                    const isActive = activeDayIdx === i;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setActiveDayIdx(isActive ? null : i)}
                                            aria-expanded={isActive}
                                            className={`text-left w-full flex flex-col gap-1 px-5 py-4 rounded-2xl border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                                isActive
                                                    ? `border-transparent bg-gradient-to-br ${layer.bgGrad} text-white shadow-lg scale-[1.02]`
                                                    : "border-slate-200 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md"
                                            }`}
                                            style={{ minHeight: 56 }}
                                        >
                                            <span className={`text-sm font-black leading-snug ${isActive ? "text-white" : "text-slate-800 dark:text-slate-100"}`}>
                                                {day.label}
                                            </span>
                                            <span className={`text-xs leading-relaxed ${isActive ? "text-white/90" : "text-slate-500 dark:text-slate-400 truncate"}`}>
                                                {day.desc}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function AIPythonCurriculum() {
    return (
        <div className="w-full max-w-4xl mx-auto mt-4 mb-2">
            <div className="my-10 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] uppercase tracking-widest font-black text-violet-600 dark:text-violet-400 mb-4 shadow-sm">
                    <Layers className="w-3.5 h-3.5" /> Visual AI &amp; Python — 30-Day Curriculum
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                    The Full 30-Day Learning Journey
                </h2>
            </motion.div>

            {/* Section 1: Introduction */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950/30 dark:via-slate-900 dark:to-blue-950/30 border border-violet-200/60 dark:border-violet-800/40 rounded-3xl p-7 sm:p-10 mb-10 shadow-sm"
            >
                <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-4">
                    This curriculum is designed to bridge the gap between abstract logic and cutting-edge Artificial Intelligence.
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-4">
                    By moving from visual block-based coding to text-based Python and finally to Augmented Reality (AR), students will understand how modern smart systems{" "}
                    <span className="font-bold text-slate-900 dark:text-white">&ldquo;see,&rdquo; &ldquo;think,&rdquo; and &ldquo;react.&rdquo;</span>
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
                    Each phase is built to turn students from passive technology users into{" "}
                    <span className="font-bold text-violet-700 dark:text-violet-300">active AI innovators.</span>
                </p>
            </motion.div>

            {/* Section 2: Objectives */}
            <div className="mb-10">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-5 text-center">Course Objectives</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {OBJECTIVES.map((obj, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                        >
                            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${obj.bg}`}>
                                <obj.icon className={`w-5 h-5 ${obj.color}`} />
                            </div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{obj.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Section 3: 30-Day Journey */}
            <div className="mb-10">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-5 text-center">
                    Tap a Layer to Explore the Days
                </p>
                <div className="flex flex-col gap-4">
                    {LAYERS.map((layer, i) => (
                        <LayerCard key={layer.id} layer={layer} defaultOpen={i === 0} />
                    ))}
                </div>
            </div>

            {/* Section 4: Outcomes */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl p-7 sm:p-10 shadow-xl border border-violet-200 dark:border-violet-800/40 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40"
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-7">
                    <div className="w-10 h-10 rounded-xl bg-yellow-400/20 dark:bg-yellow-400/10 flex items-center justify-center border border-yellow-300/50 dark:border-yellow-400/20">
                        <Trophy className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Course Outcomes</h3>
                </div>

                {/* Outcome cards */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {OUTCOMES.map((o, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -12 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-violet-100 dark:border-white/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                        >
                            <span className="text-2xl shrink-0 mt-0.5">{o.emoji}</span>
                            <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white mb-0.5">{o.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{o.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer text + CTA */}
                <div className="border-t border-violet-200 dark:border-white/10 pt-6 space-y-3">
                    <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                        By completing these 30 days, students move from simple logic to building a fully functional AI companion.
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        This course provides the ultimate foundation for careers in AI development, robotics, and software engineering, encouraging students to become the creators of tomorrow&apos;s technology.
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                        <div className="flex items-center gap-3">
                            <Rocket className="w-5 h-5 text-violet-500 dark:text-violet-400 shrink-0" />
                            <span className="text-sm font-bold text-violet-700 dark:text-violet-300">30 Days &middot; 3 Layers &middot; 1 Complete AI Companion</span>
                        </div>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-white shadow-lg hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all duration-200 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shrink-0"
                        >
                            Explore Courses <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
