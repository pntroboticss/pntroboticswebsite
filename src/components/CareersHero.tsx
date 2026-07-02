"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

// Floating particle component
function Particle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute bottom-0 rounded-full bg-cyan-400/30 dark:bg-cyan-400/20 pointer-events-none"
      style={{ left: `${x}%`, width: size, height: size }}
      animate={{
        y: [0, -800],
        opacity: [0, 0.8, 0.8, 0],
        scale: [0.5, 1, 0.8],
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  delay: i * 0.4,
  x: 5 + (i * 5.5) % 92,
  size: 3 + (i % 4) * 2,
}));

export default function CareersHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <section ref={ref} className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden">

      {/* ══════════════════════════════════════
          CINEMATIC BACKGROUND
      ══════════════════════════════════════ */}
      <div className="absolute inset-0 -z-10 overflow-hidden">

        {/* Deep dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black dark:from-[#020408] dark:via-[#040810] dark:to-black" />

        {/* Primary aurora — large vivid cyan */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.85, 0.5],
            x: [-20, 20, -20],
            y: [-10, 20, -10],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[10%] w-[700px] h-[700px] rounded-full bg-cyan-500/25 blur-[120px] pointer-events-none"
        />

        {/* Secondary aurora — blue right */}
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.7, 0.4],
            x: [20, -20, 20],
            y: [10, -20, 10],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute top-[10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none"
        />

        {/* Tertiary aurora — violet bottom */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[-20%] left-[30%] w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[100px] pointer-events-none"
        />

        {/* Bright center beam */}
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent pointer-events-none"
        />

        {/* Horizontal scan line */}
        <motion.div
          animate={{ y: ["-100%", "400%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent pointer-events-none"
        />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(6,182,212,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.9) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Vignette top */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

        {/* Floating particles */}
        {mounted && PARTICLES.map((p) => (
          <Particle key={p.id} delay={p.delay} x={p.x} size={p.size} />
        ))}
      </div>

      {/* ══════════════════════════════════════
          CONTENT (with parallax)
      ══════════════════════════════════════ */}
      <motion.div
        style={{ y, opacity }}
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-7 z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest text-cyan-300 bg-cyan-900/30 border border-cyan-500/40 backdrop-blur-sm shadow-lg shadow-cyan-500/10"
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
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none drop-shadow-2xl"
        >
          Build the Future of{" "}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-400">
              Robotics & AI
            </span>
            {/* Animated underline */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.75, ease: "easeOut" }}
              className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full origin-left shadow-lg shadow-cyan-500/50"
            />
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed font-light"
        >
          A collective of engineers, researchers, and creators solving the most complex
          real-world problems with advanced robotics.
        </motion.p>

        {/* Perks strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400"
        >
          {["Real-world impact", "Defence & Industry", "Fast growth", "Flexible work"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" strokeWidth={2} />
              {item}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="#positions"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-lg shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 hover:scale-105 transition-all duration-300 border border-cyan-400/20"
          >
            View Open Roles
          </Link>
          <Link
            href="/careers/status"
            className="px-8 py-4 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md text-white/80 font-bold hover:border-cyan-400/50 hover:bg-white/10 hover:text-white transition-all duration-300"
          >
            📋 Track My Application →
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-xs text-slate-500 uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-cyan-400/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
