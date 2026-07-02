"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

/* ─── Canvas Particle Network ─── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const NUM = 60;
    const MAX_DIST = 160;
    const particles = Array.from({ length: NUM }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 1.5 + Math.random() * 1.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99,179,237,0.7)";
        ctx.fill();
      }

      // Lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,179,237,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60"
    />
  );
}

/* ─── Word-by-word headline ─── */
const WORDS = ["Engineer", "the", "Future", "of", "Robotics"];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const word: Variants = {
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

/* ─── Hero ─── */
export default function CareersHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[88vh] flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden">

      {/* ══ BACKGROUND ══ */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Deep navy */}
        <div className="absolute inset-0 bg-[#05070d]" />

        {/* Particle network canvas */}
        <ParticleCanvas />

        {/* Radial glow — top right */}
        <motion.div
          animate={{ opacity: [0.4, 0.65, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 right-[-8%] w-[700px] h-[700px] rounded-full bg-blue-600/25 blur-[130px] pointer-events-none"
        />

        {/* Radial glow — bottom left */}
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[-15%] left-[-8%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none"
        />

        {/* Top blue border */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#05070d] to-transparent pointer-events-none" />
      </div>

      {/* ══ CONTENT (parallax) ══ */}
      <motion.div
        style={{ y, opacity }}
        className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center text-center gap-8 z-10"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-blue-400"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-8 h-px bg-blue-400 origin-left"
          />
          Careers at PNT Robotics
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-8 h-px bg-blue-400 origin-right"
          />
        </motion.div>

        {/* Headline — word stagger */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]"
        >
          {WORDS.map((w, i) => (
            <motion.span key={i} variants={word} className="inline-block mr-[0.25em] last:mr-0">
              {w === "Robotics" ? (
                <span className="text-blue-400">{w}</span>
              ) : w === "Future" ? (
                <span className="relative">
                  {w}
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="absolute -bottom-1 left-0 right-0 h-[3px] bg-blue-500/40 rounded-full origin-left"
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
          className="w-12 h-0.5 bg-blue-500 origin-center"
        />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg text-slate-300 max-w-xl leading-relaxed"
        >
          We build autonomous systems for defence, industry, and healthcare.
          Join a team solving problems that matter.
        </motion.p>

        {/* Perks */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.65 } },
          }}
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
              <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" strokeWidth={2} />
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
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-white/15 text-white/70 font-semibold text-sm hover:border-white/30 hover:bg-white/5 hover:text-white transition-all duration-200"
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
          className="w-[1px] h-14 bg-gradient-to-b from-blue-400/60 to-transparent mx-auto"
        />
      </motion.div>
    </section>
  );
}
