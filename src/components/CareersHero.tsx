"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const WORDS = ["Engineer", "the", "Future", "of", "Robotics"];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: -15 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const PERKS = ["Real-world defence & industrial projects", "Fast-paced R&D environment", "Flexible work arrangements"];

export default function CareersHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[88vh] flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-white dark:bg-[#0a0d12]" />

        {/* Accent shapes */}
        <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-blue-600/5 dark:bg-blue-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-200/60 dark:bg-slate-800/30 rounded-full blur-[100px] pointer-events-none" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle, #cbd5e1 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top border accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      </div>

      {/* ── Content ── */}
      <motion.div
        style={{ y, opacity }}
        className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center text-center gap-8 z-10"
      >
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-8 h-px bg-blue-600 dark:bg-blue-400 origin-left"
          />
          Careers at PNT Robotics
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-8 h-px bg-blue-600 dark:bg-blue-400 origin-right"
          />
        </motion.div>

        {/* Headline — word-by-word stagger */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] perspective-[800px]"
        >
          {WORDS.map((w, i) => (
            <motion.span key={i} variants={word} className="inline-block mr-[0.25em] last:mr-0">
              {w === "Robotics" ? (
                <span className="text-blue-600 dark:text-blue-400">{w}</span>
              ) : w === "Future" ? (
                <span className="relative">
                  {w}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="absolute -bottom-1 left-0 right-0 h-[3px] bg-blue-600/30 dark:bg-blue-400/30 rounded-full origin-left"
                  />
                </span>
              ) : (
                w
              )}
            </motion.span>
          ))}
        </motion.h1>

        {/* Animated divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="w-12 h-0.5 bg-blue-600 dark:bg-blue-500 origin-center"
        />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed"
        >
          We build autonomous systems for defence, industry, and healthcare.
          Join a team solving problems that matter.
        </motion.p>

        {/* Perks — staggered */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } } }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate-500 dark:text-slate-400"
        >
          {PERKS.map((item) => (
            <motion.span
              key={item}
              variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } } }}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" strokeWidth={2} />
              {item}
            </motion.span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85 }}
          className="flex flex-col sm:flex-row items-center gap-3 pt-2"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="#positions"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors duration-200 shadow-lg shadow-blue-600/20"
            >
              View Open Roles
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/careers/status"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
            >
              Track Application
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-14 bg-gradient-to-b from-slate-400 to-transparent mx-auto"
        />
      </motion.div>
    </section>
  );
}
