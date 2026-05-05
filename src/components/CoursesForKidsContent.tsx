"use client";

import CampSeasonToggle from "@/components/CampSeasonToggle";
import {
    Monitor, Wrench, Brain, Clock, MessageSquare, ArrowRight,
    Star, Zap, Users, GraduationCap, Phone, Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import RoboticsCurriculum from "./RoboticsCurriculum";
import AIPythonCurriculum from "./AIPythonCurriculum";
import TestimonialsSlider from "./TestimonialsSlider";

// ─── Colour Configs ───────────────────────────────────────────────────────────
interface CourseCardProps {
    level: "Basic" | "Advanced";
    gradFrom: string;   // e.g. "#38bdf8"
    gradTo: string;     // e.g. "#6366f1"
    icon: React.ReactNode;
    tag: string;
    title: string;
    description: string;
    bullets: string[];
    ctaLabel: string;
    note?: string;
}

// ─── Interactive Glassmorphism Card ──────────────────────────────────────────
function CourseCard({
    level,
    gradFrom,
    gradTo,
    icon,
    tag,
    title,
    description,
    bullets,
    ctaLabel,
    note,
}: CourseCardProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const rotateX = useSpring(useTransform(mouseY, [-1, 1], [6, -6]), { stiffness: 200, damping: 25 });
    const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), { stiffness: 200, damping: 25 });
    const glowX   = useTransform(mouseX, [-1, 1], [0, 100]);
    const glowY   = useTransform(mouseY, [-1, 1], [0, 100]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
        mouseY.set(((e.clientY - rect.top)  / rect.height - 0.5) * 2);
    };
    const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

    const isBasic   = level === "Basic";
    const levelColor = isBasic ? gradFrom : gradTo;

    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1000 }}
            className="group block relative"
        >
            <motion.div
                style={{ rotateX, rotateY }}
                className="relative flex flex-col rounded-3xl overflow-hidden h-full z-10"
            >
                {/* --- Gradient border glow (always visible, intensifies on hover) --- */}
                <div
                    className="absolute inset-0 rounded-3xl transition-opacity duration-300 opacity-60 group-hover:opacity-100 pointer-events-none"
                    style={{ padding: 1.5, background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})`, WebkitMaskComposite: "destination-out", maskComposite: "exclude" }}
                />
                <div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{ boxShadow: `0 0 0 1.5px ${gradFrom}55` }}
                />

                {/* --- Moving glow under cursor --- */}
                <motion.div
                    className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: useTransform([glowX, glowY], ([x, y]) =>
                            `radial-gradient(circle at ${x}% ${y}%, ${gradFrom}25, transparent 60%)`
                        ),
                    }}
                />

                {/* --- Card surface --- */}
                <div className="relative flex flex-col h-full rounded-3xl border border-slate-200/80 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300">

                    {/* ── Coloured gradient header ── */}
                    <div
                        className="relative px-7 pt-8 pb-8"
                        style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
                    >
                        {/* Glossy sheen */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                        {/* Level badge */}
                        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full mb-5 bg-white/20 text-white border border-white/30">
                            {isBasic ? <Star className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                            {level} Level
                        </span>

                        {/* Icon box */}
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg border border-white/25"
                            style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}
                        >
                            {icon}
                        </div>

                        <h3 className="text-xl font-black text-white leading-snug drop-shadow-sm">{title}</h3>
                    </div>

                    {/* ── Card body ── */}
                    <div className="relative flex flex-col flex-grow px-7 pt-6 pb-7 bg-white dark:bg-slate-900/40">
                        {/* Audience pill */}
                        <span
                            className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-xl text-xs font-bold mb-5 border"
                            style={{
                                color: levelColor,
                                background: `${levelColor}14`,
                                borderColor: `${levelColor}40`,
                            }}
                        >
                            <Users className="w-3.5 h-3.5 shrink-0" />
                            {tag}
                        </span>

                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">{description}</p>

                        {/* What you'll learn header */}
                        <div className="flex items-center gap-3 mb-4">
                            <GraduationCap className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">What you'll learn</span>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                        </div>

                        {/* Bullets styled like the detail panel step list */}
                        <ul className="space-y-2.5 mb-6 flex-grow">
                            {bullets.map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div
                                        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black border"
                                        style={{
                                            background: `${levelColor}20`,
                                            borderColor: `${levelColor}40`,
                                            color: levelColor,
                                        }}
                                    >
                                        {i + 1}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 pt-0.5 leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>

                        {note && (
                            <p className="text-[11px] italic text-slate-400 dark:text-slate-500 mb-4">{note}</p>
                        )}

                        {/* CTA */}
                        <div className="relative z-50 mt-auto">
                            <Link
                                href="/contact"
                                className="group/btn inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-black text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 pointer-events-auto"
                                style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
                            >
                                {ctaLabel}
                                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({ label, title, subtitle, color }: { label: string; title: string; subtitle: string; color: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center max-w-3xl mx-auto"
        >
            <span className={`inline-block px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] uppercase tracking-widest font-black ${color} mb-4 shadow-sm`}>
                {label}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">{title}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">{subtitle}</p>
        </motion.div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CoursesForKidsContent() {
    return (
        <section className="py-16 sm:py-20 container mx-auto px-4 sm:px-6 max-w-7xl">

            {/* ── ROBOTICS ──────────────────────────────────────────── */}
            <SectionHeading
                label="🌐 Available Online & Offline"
                title="Robotics & Hardware Labs"
                subtitle="From the comfort of your room or right here in our high-tech lab — choose your battle station and start engineering the robots of tomorrow."
                color="text-blue-600 dark:text-blue-400"
            />

            <div className="grid sm:grid-cols-2 max-w-4xl mx-auto gap-6 sm:gap-8 mb-20 sm:mb-32">
                <CourseCard
                    level="Basic"
                    gradFrom="#38bdf8"
                    gradTo="#6366f1"
                    icon={<Wrench className="w-7 h-7 text-white" />}
                    tag="Online & Offline · Ages 8–12"
                    title="Basic Robotics"
                    description="The perfect launchpad for young creators! Choose between our immersive interactive online coding simulator or get hands-on with live wiring and assembly in our state-of-the-art lab."
                    bullets={[
                        "Scratch logic & drag-and-drop",
                        "Arduino simulators & basic wiring",
                        "Tinkercad 3D modeling",
                        "Fun introductory challenges",
                    ]}
                    ctaLabel="Enquire Now"
                />

                <CourseCard
                    level="Advanced"
                    gradFrom="#818cf8"
                    gradTo="#a855f7"
                    icon={<Monitor className="w-7 h-7 text-white" />}
                    tag="Online & Offline · Ages 12–16"
                    title="Advanced Robotics"
                    description="Challenge accepted! Dive deep into text-based programming, conquer complex multi-sensor systems, and compete in advanced drone or simulation challenges."
                    bullets={[
                        "Python OOP & C++",
                        "Drone assembly & tuning",
                        "Multi-sensor hardware systems",
                        "Real-world AI & ML basics",
                    ]}
                    ctaLabel="Enquire Now"
                />
            </div>

            {/* ── Expandable Full Curriculum Accordion ── */}
            <RoboticsCurriculum />

            <div className="my-24 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent max-w-lg mx-auto" />

            {/* ── AI & PYTHON ───────────────────────────────────────── */}
            <SectionHeading
                label="🤖 AI & Programming"
                title="AI & Software Programs"
                subtitle="From Python fundamentals to real AI projects — chatbots, image classifiers, and full automation pipelines."
                color="text-emerald-600 dark:text-emerald-400"
            />

            <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-6 sm:gap-8 mb-32">
                <CourseCard
                    level="Basic"
                    gradFrom="#34d399"
                    gradTo="#059669"
                    icon={<Brain className="w-7 h-7 text-white" />}
                    tag="Best for ages 10–13"
                    title="AI & Python — Basic"
                    description="Your coding journey begins here! Learn Python from the ground up with fun, bite-sized projects that build real problem-solving confidence along the way."
                    bullets={[
                        "Python syntax, variables & loops",
                        "Functions & conditions",
                        "Basic data structures (lists, dicts)",
                        "Simple automation scripts",
                    ]}
                    ctaLabel="Get Details"
                    note="* Detailed curriculum updating soon. Contact us for early access."
                />

                <CourseCard
                    level="Advanced"
                    gradFrom="#2dd4bf"
                    gradTo="#0891b2"
                    icon={<Brain className="w-7 h-7 text-white" />}
                    tag="Best for ages 13–16"
                    title="AI & Python — Advanced"
                    description="Build the future! Train real machine learning models, create chatbots with NLP, develop image classifiers, and ship complete automation pipelines."
                    bullets={[
                        "Machine Learning models & concepts",
                        "Chatbot & NLP projects",
                        "Image classifier with TensorFlow",
                        "APIs & full automation pipelines",
                    ]}
                    ctaLabel="Get Details"
                    note="* Detailed curriculum updating soon. Contact us for early access."
                />
            </div>

            {/* ── Visual AI & Python 30-Day Curriculum ── */}
            <AIPythonCurriculum />

            {/* ── Customized Courses ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-24"
            >
                <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl border border-amber-200 dark:border-amber-800/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/60 via-orange-50/30 to-transparent dark:from-amber-900/20 dark:via-orange-900/10 dark:to-transparent pointer-events-none rounded-3xl" />
                    <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
                            <Clock className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Customized Courses</h3>
                                <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10">
                                    48 HRS
                                </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-lg">
                                Need a tailored curriculum? We design custom 48-hour programs covering any combination of Robotics, AI, IoT, and Coding modules. Contact us to build your ideal learning path.
                            </p>
                        </div>
                        <Link
                            href="/contact"
                            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
                        >
                            <MessageSquare className="w-4 h-4" /> Request Custom Course
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* ── Tip notice ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 max-w-2xl mx-auto mb-16 p-4 rounded-2xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-700 dark:text-blue-300"
            >
                <Lightbulb className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
                <span>
                    <strong>Pro tip:</strong> Hover over each course card to see a 3D tilt effect — and tap the interactive syllabus above to explore each day and project in detail!
                </span>
            </motion.div>

            {/* ── Summer / Winter Camp Toggle ── */}
            <CampSeasonToggle />

            {/* ── Kids Testimonials ── */}
            <div className="mt-20">
                <TestimonialsSlider category="kids" title="Bootcamp Student Testimonials" subtitle="What Parents Say" />
            </div>

            {/* ── Bottom CTA ── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-32 mb-10 text-center relative z-10"
            >
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                    Ready to Build the Future?
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                    Take the first step towards mastering robotics and AI. Secure a spot for your child in our upcoming batch or let's find the perfect program together.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <Link
                        href="/contact"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-1 transition-all"
                    >
                        Enroll Now <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                        href="/contact"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-750 hover:-translate-y-1 transition-all shadow-md"
                    >
                        <Phone className="w-5 h-5" /> Talk to an Advisor
                    </Link>
                </div>
            </motion.div>

        </section>
    );
}
