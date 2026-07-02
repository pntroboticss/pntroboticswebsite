"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const STATS = [
  { value: "50+", label: "Projects Delivered" },
  { value: "10+", label: "Years of R&D" },
  { value: "3x", label: "Defence Deployments" },
  { value: "100%", label: "Growth Rate" },
];

export default function CareersHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-12 overflow-x-hidden">
      {/* ── Animated background layers ── */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#060a14] dark:via-[#080d1a] dark:to-[#060a14]" />

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
          style={{
            backgroundImage: `linear-gradient(rgba(6,182,212,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.8) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Center glow */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1.05, 1, 1.05], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[80px]"
        />
      </div>

      {/* ── Parallax content ── */}
      <motion.div style={{ y, opacity }} className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-8 z-10">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest text-cyan-400 bg-cyan-900/20 dark:bg-cyan-900/30 border border-cyan-500/30"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          We're Hiring · Join Our Team
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter text-slate-900 dark:text-white leading-none max-w-6xl"
        >
          Build the{" "}
          <br className="hidden md:block" />
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 animate-pulse-slow">
              Future
            </span>
            {/* Underline decoration */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full origin-left"
            />
          </span>
          {" "}of Robotics
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed font-light"
        >
          We are a collective of engineers, researchers, and creators dedicated to solving the most complex real-world problems with advanced robotics & AI.
        </motion.p>

        {/* Perks strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400"
        >
          {["Real-world impact", "Defence & Industry", "Fast growth", "Flexible work"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-500" strokeWidth={2} />
              {item}
            </span>
          ))}
        </motion.div>

        {/* Application tracker CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-2"
        >
          <Link
            href="#positions"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300"
          >
            View Open Roles
          </Link>
          <Link
            href="/careers/status"
            className="px-8 py-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md text-slate-700 dark:text-slate-300 font-bold hover:border-cyan-400 dark:hover:border-cyan-500 transition-all duration-300"
          >
            📋 Track My Application →
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 w-full max-w-3xl"
        >
          {STATS.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">{stat.value}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 text-center font-medium">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-400 dark:text-slate-600 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-slate-400 dark:bg-slate-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}
