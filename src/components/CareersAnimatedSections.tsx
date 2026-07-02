"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  Cpu, Globe, TrendingUp, Heart, MapPin, Clock, ChevronRight,
  Sparkles, Zap, Shield, GraduationCap, Send, ArrowRight, Star
} from "lucide-react";

const BENEFITS = [
  {
    title: "Cutting-Edge Tech",
    icon: Cpu,
    desc: "Work with the latest in robotics, AI, and autonomous systems.",
    color: "from-cyan-500 to-blue-600",
    glow: "shadow-cyan-500/20",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    border: "border-cyan-200 dark:border-cyan-800/50",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/50",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    title: "Impactful Work",
    icon: Globe,
    desc: "Build solutions for the Indian Army, Navy, and leading enterprises.",
    color: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/20",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800/50",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Continuous Growth",
    icon: TrendingUp,
    desc: "Learn fast in a top startup environment with endless opportunities.",
    color: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-800/50",
    iconBg: "bg-violet-100 dark:bg-violet-900/50",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    title: "Health & Wellness",
    icon: Heart,
    desc: "Comprehensive health coverage and flexible working arrangements.",
    color: "from-rose-500 to-pink-600",
    glow: "shadow-rose-500/20",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-200 dark:border-rose-800/50",
    iconBg: "bg-rose-100 dark:bg-rose-900/50",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const lineVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center mb-16"
    >
      <span className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-500 dark:text-cyan-400 mb-3 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-800/60 bg-cyan-50 dark:bg-cyan-950/30">
        {eyebrow}
      </span>
      <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">{title}</h2>
      {subtitle && <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
      <motion.div
        variants={lineVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-6 mx-auto h-px w-32 bg-gradient-to-r from-transparent via-cyan-500 to-transparent origin-center"
      />
    </motion.div>
  );
}

export default function CareersAnimatedSections({ openPositions }: { openPositions: any[] }) {
  const [hoveredPos, setHoveredPos] = useState<number | null>(null);
  const internRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: internScroll } = useScroll({ target: internRef, offset: ["start end", "end start"] });
  const internY = useTransform(internScroll, [0, 1], [-30, 30]);

  return (
    <div className="relative">
      {/* ─── Ambient background orbs ─── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[-5%] w-[30rem] h-[30rem] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-[50%] right-[-5%] w-[25rem] h-[25rem] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* ═══════════════════════════════
          1. BENEFITS SECTION
      ═══════════════════════════════ */}
      <section className="mb-32">
        <SectionHeader
          eyebrow="Why Us"
          title="Built to Inspire Your Best Work"
          subtitle="Everything you need to do the most impactful work of your career."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {BENEFITS.map((b, idx) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
                className={`relative group rounded-3xl border ${b.border} ${b.bg} p-8 overflow-hidden cursor-default`}
              >
                {/* Card glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${b.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
                
                {/* Shimmer line */}
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${b.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className={`w-14 h-14 rounded-2xl ${b.iconBg} flex items-center justify-center mb-6 shadow-inner border ${b.border}`}>
                  <Icon className={`w-7 h-7 ${b.iconColor}`} strokeWidth={1.5} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">{b.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{b.desc}</p>

                {/* Bottom gradient accent */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r ${b.color} opacity-30`} />
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ═══════════════════════════════
          2. OPEN POSITIONS SECTION
      ═══════════════════════════════ */}
      <section className="mb-32">
        <SectionHeader
          eyebrow="Open Roles"
          title="Open Positions"
          subtitle="Find your next challenge. Join a team building the future of autonomous robotics."
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={openPositions?.length}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {openPositions?.map((pos, idx) => (
              <motion.div
                key={pos.id || idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onHoverStart={() => setHoveredPos(idx)}
                onHoverEnd={() => setHoveredPos(null)}
                className="group relative"
              >
                {/* Hover glow backdrop */}
                <AnimatePresence>
                  {hoveredPos === idx && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 rounded-[2rem] blur-sm"
                    />
                  )}
                </AnimatePresence>

                <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8 group-hover:border-cyan-400/50 dark:group-hover:border-cyan-500/50 transition-all duration-400 flex flex-col sm:flex-row sm:items-center gap-6">
                  
                  {/* Animated left accent bar */}
                  <motion.div
                    animate={{ height: hoveredPos === idx ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-l-3xl"
                  />

                  <div className="flex-1 pl-2">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 py-1.5 px-3 rounded-full border border-cyan-200 dark:border-cyan-800/60">
                        <Clock className="w-3 h-3" /> {pos.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-1.5 px-3 rounded-full border border-slate-200 dark:border-slate-700">
                        <MapPin className="w-3 h-3" /> {pos.location}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                      {pos.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl line-clamp-2 leading-relaxed">
                      {pos.description}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Link
                      href={`/careers/${pos.id}`}
                      className="group/btn inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-white dark:hover:from-cyan-500 dark:hover:to-blue-600 dark:hover:text-white transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 hover:shadow-xl"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}

            {(!openPositions || openPositions.length === 0) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30"
              >
                <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
                  <Zap className="w-8 h-8 text-slate-400" />
                </div>
                <p className="font-black text-xl text-slate-700 dark:text-slate-300 mb-2">No openings at the moment</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm">Check back soon or apply for an internship below!</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ═══════════════════════════════
          3. INTERNSHIP BANNER
      ═══════════════════════════════ */}
      <section className="mb-32">
        <motion.div
          ref={internRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[3rem] border border-cyan-200/60 dark:border-cyan-800/30"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-cyan-950 to-blue-950" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/10 to-blue-500/15" />

          {/* Animated mesh grid */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)`,
              backgroundSize: "60px 60px"
            }}
          />

          {/* Floating orbs with parallax */}
          <motion.div style={{ y: internY }} className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[80px] -translate-y-1/3 translate-x-1/3" />
          <motion.div style={{ y: internY }} className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-blue-600/20 blur-[60px] translate-y-1/3 -translate-x-1/3" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 p-10 md:p-16 lg:p-20">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring", bounce: 0.4 }}
              className="shrink-0"
            >
              <div className="relative w-28 h-28 rounded-[2rem] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/40 border border-white/20">
                <GraduationCap className="w-14 h-14 text-white" strokeWidth={1.5} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-3 h-3 text-yellow-900" fill="currentColor" />
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4 px-3 py-1 rounded-full border border-cyan-700/50 bg-cyan-900/30">
                  Open to Students
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight leading-none">
                  Internship{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                    Openings
                  </span>
                </h2>
                <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
                  Kickstart your career in advanced robotics. Work on real-world military and industrial projects that actually matter.
                </p>
              </motion.div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="shrink-0"
            >
              <Link
                href="/careers/internship"
                className="group/cta relative inline-flex flex-col items-center justify-center px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white font-black text-xl shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-105 transition-all duration-300 border border-white/10"
              >
                <span className="flex items-center gap-3">
                  Apply Now
                  <ChevronRight className="w-5 h-5 group-hover/cta:translate-x-1 transition-transform" />
                </span>
                <span className="text-xs font-normal text-cyan-100 mt-1">Rolling admissions</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════
          4. SPONTANEOUS APPLICATION CTA
      ═══════════════════════════════ */}
      <section className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[3rem] bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl p-12 md:p-20 text-center"
        >
          {/* Subtle dotted background */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: `radial-gradient(circle, #0ea5e9 1px, transparent 1px)`, backgroundSize: "32px 32px" }}
          />

          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[80px]" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/20"
            >
              <Send className="w-8 h-8 text-white" strokeWidth={1.5} />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Don't see a perfect fit?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
              We're always hunting for exceptionally talented individuals. Tell us what you can do—we'll find a place for you.
            </p>
            <motion.a
              href="mailto:hr@pntsolution.in?subject=Spontaneous%20Application"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 font-black text-lg hover:from-cyan-600 hover:to-blue-600 hover:text-white dark:hover:from-cyan-500 dark:hover:to-blue-600 dark:hover:text-white transition-all duration-300 shadow-2xl shadow-slate-900/20 hover:shadow-cyan-500/25"
            >
              <Sparkles className="w-5 h-5" />
              Send Spontaneous Application
            </motion.a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
