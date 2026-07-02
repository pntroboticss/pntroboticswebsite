"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

/* ─────────────────────────────────────────
   Aurora Mesh Background
   Multiple large gradient blobs that drift
   and breathe — Apple / Stripe style
───────────────────────────────────────── */
function AuroraMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-[#05070e]" />

      {/* Blob 1 — vivid blue, top center */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[15%] w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(37,99,235,0.55) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Blob 2 — cyan, top right */}
      <motion.div
        animate={{
          x: [0, -60, 30, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.40) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      {/* Blob 3 — violet, bottom left */}
      <motion.div
        animate={{
          x: [0, 60, -20, 0],
          y: [0, -40, 60, 0],
          scale: [1.05, 1, 1.12, 1.05],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute bottom-[-20%] left-[-10%] w-[580px] h-[580px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />

      {/* Blob 4 — indigo, center */}
      <motion.div
        animate={{
          x: [0, -50, 70, 0],
          y: [0, 60, -50, 0],
          scale: [0.9, 1.1, 0.95, 0.9],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 8 }}
        className="absolute top-[30%] left-[35%] w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(79,70,229,0.30) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* Blob 5 — teal, bottom right */}
      <motion.div
        animate={{
          x: [0, -70, 30, 0],
          y: [0, -50, 40, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-[-10%] right-[5%] w-[450px] h-[450px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(20,184,166,0.25) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Noise overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Vignette — keeps edges dark so text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(5,7,14,0.7) 100%)",
        }}
      />

      {/* Top border line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#05070e] to-transparent" />
    </div>
  );
}

/* ─── Word-by-word headline ─── */
const WORDS = ["Engineer", "the", "Future", "of", "Robotics"];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const wordVar: Variants = {
  hidden: { opacity: 0, y: 30, rotateX: -15 },
  visible: {
    opacity: 1, y: 0, rotateX: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

const PERKS = [
  "Real-world defence & industrial projects",
  "Fast-paced R&D environment",
  "Flexible work arrangements",
];

/* ─── Main Export ─── */
export default function CareersHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[88vh] flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden">

      {/* Aurora mesh background */}
      <div className="absolute inset-0 -z-10">
        <AuroraMesh />
      </div>

      {/* ── Content (parallax on scroll) ── */}
      <motion.div
        style={{ y, opacity }}
        className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center text-center gap-8 z-10"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-blue-300"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-8 h-px bg-blue-300 origin-left"
          />
          Careers at PNT Robotics
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-8 h-px bg-blue-300 origin-right"
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]"
        >
          {WORDS.map((w, i) => (
            <motion.span key={i} variants={wordVar} className="inline-block mr-[0.25em] last:mr-0">
              {w === "Robotics" ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                  {w}
                </span>
              ) : w === "Future" ? (
                <span className="relative">
                  {w}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400/50 to-blue-500/50 rounded-full origin-left"
                  />
                </span>
              ) : w}
            </motion.span>
          ))}
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 origin-center"
        />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg text-slate-300/90 max-w-xl leading-relaxed"
        >
          We build autonomous systems for defence, industry, and healthcare.
          Join a team solving problems that matter.
        </motion.p>

        {/* Perks */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.65 } } }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate-400"
        >
          {PERKS.map((item) => (
            <motion.span
              key={item}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
              }}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" strokeWidth={2} />
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
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="#positions"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors duration-200 shadow-xl shadow-blue-600/30"
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

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/careers/status"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-white/15 text-white/70 font-semibold text-sm hover:border-white/30 hover:bg-white/5 hover:text-white transition-all duration-200 backdrop-blur-sm"
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
          className="w-[1px] h-14 bg-gradient-to-b from-cyan-400/60 to-transparent mx-auto"
        />
      </motion.div>
    </section>
  );
}
