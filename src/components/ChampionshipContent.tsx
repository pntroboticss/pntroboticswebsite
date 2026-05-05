"use client";

import { motion } from "framer-motion";
import {
    Trophy, Users, Lightbulb, Presentation, Building2,
    Calendar, CheckCircle2, ChevronRight, Medal,
    Star, Rocket, ArrowRight
} from "lucide-react";
import Link from "next/link";

import NetworkBackground from "./NetworkBackground";

// ── DATA STRUCTURES FOR CLEAN RENDERING ─────────────────────────────

const OBJECTIVES = [
    { title: "Critical Thinking", desc: "Encourage students to think critically about real-life problems", icon: Lightbulb },
    { title: "Hands-on Learning", desc: "Promote hands-on prototyping and design thinking concepts", icon: Rocket },
    { title: "Team Collaboration", desc: "Develop teamwork, delegation, and communication skills", icon: Users },
    { title: "Shark Tank Format", desc: "Provide exposure to innovation-driven evaluation formats", icon: Presentation },
    { title: "Confidence Building", desc: "Build confidence in presenting ideas and functional solutions", icon: Star },
];

const ROUNDS = [
    {
        round: "Round 1",
        title: "Online Team-Based Ideation",
        date: "December/January",
        type: "Virtual Submission",
        focus: [
            "Idea clarity and feasibility",
            "Understanding of basic robotics concepts",
            "Logical explanation and teamwork"
        ],
        requirements: "Teams will present what they propose to build. They must explain their identified problem statement, their solution concept, and the basic working approach including intended use of sensors."
    },
    {
        round: "Round 2",
        title: "Offline Final Build & Demo",
        date: "December/January",
        type: "In-Person Finale",
        focus: [
            "Innovation and creativity",
            "Conceptual understanding",
            "Practical implementation",
            "Presentation and demonstration skills"
        ],
        requirements: "Shortlisted teams will build their proposed solution, present the working prototype, and explain its application and functionality directly to our expert jury panel."
    }
];

const ELIGIBILITY_SCHOOL = [
    { icon: Users, title: "Team Based", desc: "5 students per team" },
    { icon: GraduationCapIcon, title: "Eligibility", desc: "Grade 4 to 8 students" },
    { icon: Building2, title: "Supervision", desc: "1 School Coordinator required" },
    { icon: MapPinIcon, title: "Participation", desc: "Open to partner schools" },
];

const ELIGIBILITY_INDIVIDUAL = [
    { icon: Users, title: "Individual or Team", desc: "Participate solo or with friends" },
    { icon: GraduationCapIcon, title: "Eligibility", desc: "Grade 4 to 8 students" },
    { icon: Building2, title: "Supervision", desc: "Parent/Guardian consent required" },
    { icon: MapPinIcon, title: "Participation", desc: "Open to all students globally" },
];

// Reusing some basic SVG icons as components for variety
function GraduationCapIcon(props: any) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>;
}
function MapPinIcon(props: any) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
}


export default function ChampionshipContent({
    isIndividual = false,
    registrationLink = "#"
}: {
    isIndividual?: boolean;
    registrationLink?: string;
}) {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const yearString = `${currentYear}-${nextYear.toString().slice(-2)}`;

    const eligibilityData = isIndividual ? ELIGIBILITY_INDIVIDUAL : ELIGIBILITY_SCHOOL;

    return (
        <div className="w-full relative z-10 pt-24 pb-20">
            <NetworkBackground />

            {/* ════════════════════════════════════════════════════════
                HERO SECTION
            ════════════════════════════════════════════════════════ */}
            <section className="relative w-full overflow-hidden mb-20">
                {/* Visual Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-[100px] opacity-50 dark:opacity-30 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 relative z-10 text-center py-20">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold uppercase tracking-widest text-sm mb-6 shadow-sm"
                    >
                        <Trophy className="w-4 h-4" />
                        PNT Academy Presents
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight flex items-center justify-center gap-3 flex-wrap"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 animate-gradient-x">
                            Skill Tank
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600">
                            {yearString}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        The ultimate inter-school innovation and robotics competition fostering experiential STEM learning and structured problem-solving.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <a href="mailto:Contact@pntacademy.com" className="px-8 py-4 rounded-xl font-bold border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                            Contact Organizers
                        </a>
                        <a href={registrationLink} target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center gap-2">
                            {isIndividual ? "Register Now" : "School Registration"} <ArrowRight className="w-5 h-5" />
                        </a>
                    </motion.div>
                </div>
            </section>


            {/* ════════════════════════════════════════════════════════
                ELIGIBILITY GRID
            ════════════════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-4 mb-24 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {eligibilityData.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center shadow-sm"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                COMPETITION STRUCTURE
            ════════════════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-4 mb-24 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Competition Structure</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">A two-phased journey from conceptual ideation to physical prototyping.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {ROUNDS.map((round, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden group hover:border-blue-500/50 transition-colors"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

                            <div className="flex items-center justify-between mb-8">
                                <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm uppercase tracking-wider">
                                    {round.round}
                                </div>
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                                    <Calendar className="w-4 h-4" />
                                    {round.date}
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{round.title}</h3>
                            <p className="text-purple-600 dark:text-purple-400 font-semibold mb-6">{round.type} • Theme: Robotics</p>

                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                                {round.requirements}
                            </p>

                            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-widest text-slate-500">Evaluation Focus</h4>
                                <ul className="space-y-3">
                                    {round.focus.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm font-medium">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                THE JURY & OBJECTIVES (Side by side)
            ════════════════════════════════════════════════════════ */}
            <section className="max-w-6xl mx-auto px-4 mb-24 relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-blue-950 dark:from-slate-950 dark:to-blue-950 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
                        <Star className="w-12 h-12 text-amber-400 mb-6" />
                        <h2 className="text-3xl font-black mb-4 tracking-tight">Expert Jury Panel</h2>
                        <p className="text-blue-100 leading-relaxed max-w-md mb-8">
                            Skill Tank is evaluated by a panel of industry professionals and academic experts. To provide true real-world validation, this includes a startup entrepreneur previously featured as a contestant on <strong className="text-white bg-blue-900/50 px-2 py-0.5 rounded">Shark Tank</strong>.
                        </p>

                        <div className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-blue-300">Outcomes & Awards</h4>
                            <div className="flex items-center gap-3">
                                <Medal className="w-6 h-6 text-amber-400 shrink-0" />
                                <span className="font-medium text-slate-200">Exciting prices and medals for top teams</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
                                <span className="font-medium text-slate-200">Certificates of National Recognition</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Presentation className="w-6 h-6 text-amber-400 shrink-0" />
                                <span className="font-medium text-slate-200">Early exposure to engineering thinking</span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="lg:col-span-7">
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Educational Objectives</h2>
                            <p className="text-slate-600 dark:text-slate-400">Skill Tank emphasizes conceptual understanding and idea articulation over advanced technical complexity, making STEM accessible to all.</p>
                        </div>

                        <div className="space-y-4">
                            {OBJECTIVES.map((obj, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                                >
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl shrink-0 mt-1">
                                        <obj.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{obj.title}</h4>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{obj.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                ROLE OF SCHOOLS & CONTACT BANNER
            ════════════════════════════════════════════════════════ */}
            <section className="max-w-4xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xl"
                >
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                        {isIndividual ? "Participant Guidelines" : "Role of Participating Schools"}
                    </h2>
                    <ul className="grid sm:grid-cols-2 gap-4 mb-10">
                        {isIndividual ? (
                            <>
                                <li className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Submit an original project idea</span>
                                </li>
                                <li className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Prepare for online idea pitch</span>
                                </li>
                                <li className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Ensure parental consent</span>
                                </li>
                                <li className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Manage own hardware setup</span>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Nominate eligible student teams</span>
                                </li>
                                <li className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Appoint a school coordinator</span>
                                </li>
                                <li className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Ensure parental consent & discipline</span>
                                </li>
                                <li className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <ChevronRight className="w-5 h-5 text-blue-500 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Manage travel & local logistics</span>
                                </li>
                            </>
                        )}
                    </ul>

                    <div className="bg-gradient-to-r from-blue-50 dark:from-blue-950/30 to-purple-50 dark:to-purple-950/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-100 dark:border-blue-900">
                        <div>
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">Official Contact</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Reach out to our Relationship Manager for registration packets and school guidelines.</p>

                            <div className="space-y-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                <div className="flex items-center gap-2"><span className="text-blue-500 font-bold">Name:</span> Srushti Angane</div>
                                <div className="flex items-center gap-2"><span className="text-blue-500 font-bold">Phone:</span> +91 9326014648</div>
                                <div className="flex items-center gap-2 hidden"><span className="text-blue-500 font-bold">Email:</span> pnt-trainings@pntacademy.com</div>
                            </div>
                        </div>
                        <a href="tel:9326014648" className="w-full md:w-auto text-center px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl shadow-lg hover:scale-105 transition-transform shrink-0">
                            Call Now
                        </a>
                    </div>
                </motion.div>
            </section>

        </div>
    );
}
