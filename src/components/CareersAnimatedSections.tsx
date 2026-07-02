"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  Cpu, Globe, TrendingUp, Heart, MapPin, Clock,
  GraduationCap, Send, ArrowRight, ChevronRight
} from "lucide-react";

const BENEFITS = [
  {
    title: "Cutting-Edge Technology",
    icon: Cpu,
    desc: "Work alongside engineers deploying robotics in live defence and industrial environments.",
  },
  {
    title: "Impactful Work",
    icon: Globe,
    desc: "Build systems deployed by the Indian Army, Navy, and Fortune 500 enterprises.",
  },
  {
    title: "Continuous Growth",
    icon: TrendingUp,
    desc: "Steep learning curve. Direct mentorship. Ownership of real projects from day one.",
  },
  {
    title: "Health & Wellness",
    icon: Heart,
    desc: "Comprehensive health coverage, wellness benefits, and flexible work arrangements.",
  },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay, ease: "easeOut" as const },
  };
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-4 h-px bg-blue-600 dark:bg-blue-500" />
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">
        {label}
      </span>
    </div>
  );
}

export default function CareersAnimatedSections({ openPositions }: { openPositions: any[] }) {
  const [hoveredPos, setHoveredPos] = useState<number | null>(null);
  const internRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: internScroll } = useScroll({ target: internRef, offset: ["start end", "end start"] });
  const internY = useTransform(internScroll, [0, 1], [-20, 20]);

  return (
    <div className="relative space-y-28 pb-12">

      {/* ═══════════════════════════════
          1. WHY PNT ROBOTICS
      ═══════════════════════════════ */}
      <section>
        <motion.div {...fadeUp()}>
          <SectionLabel label="Why us" />
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
            Built for serious engineers.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg">
            We work on hard problems in autonomous systems. If you want to do the most important work of your career, this is the place.
          </p>
        </motion.div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map((b, idx) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={idx}
                {...fadeUp(idx * 0.08)}
                className="group p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-5 border border-blue-100 dark:border-blue-800/50">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">{b.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════
          2. OPEN POSITIONS
      ═══════════════════════════════ */}
      <section id="positions">
        <motion.div {...fadeUp()} className="flex items-end justify-between mb-8">
          <div>
            <SectionLabel label="Open Roles" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              Open Positions
            </h2>
          </div>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 pb-1">
            {openPositions?.length || 0} {openPositions?.length === 1 ? "role" : "roles"} available
          </span>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-slate-200 dark:bg-slate-800 mb-6" />

        <div className="space-y-3">
          {openPositions?.map((pos, idx) => (
            <motion.div
              key={pos.id || idx}
              {...fadeUp(idx * 0.06)}
              onHoverStart={() => setHoveredPos(idx)}
              onHoverEnd={() => setHoveredPos(null)}
              className="group relative flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-300"
            >
              {/* Blue accent on hover */}
              <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex-1 pl-1">
                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {pos.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {pos.type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {pos.location}
                  </span>
                </div>
                {pos.description && (
                  <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 line-clamp-1 max-w-2xl">
                    {pos.description}
                  </p>
                )}
              </div>

              <div className="shrink-0">
                <Link
                  href={`/careers/${pos.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold group-hover:border-blue-600 group-hover:text-blue-600 group-hover:bg-blue-50 dark:group-hover:border-blue-500 dark:group-hover:text-blue-400 dark:group-hover:bg-blue-900/10 transition-all duration-200"
                >
                  Apply
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}

          {(!openPositions || openPositions.length === 0) && (
            <motion.div {...fadeUp()} className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <p className="font-semibold text-slate-600 dark:text-slate-400 mb-1">No open positions right now</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">Check back soon, or apply speculatively below.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════
          3. INTERNSHIP BANNER
      ═══════════════════════════════ */}
      <section>
        <motion.div
          ref={internRef}
          {...fadeUp()}
          className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
        >
          {/* Subtle blue accent line at top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

          {/* Paralax background shape */}
          <motion.div
            style={{ y: internY }}
            className="absolute right-0 top-0 w-72 h-72 bg-blue-500/5 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3 pointer-events-none"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
            <div className="shrink-0 w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <GraduationCap className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>

            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">
                Open to students
              </p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                Internship Programme
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
                Work on live robotics deployments with direct mentorship from our senior engineers. Rolling intake.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/careers/internship"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors duration-200 shadow-lg shadow-blue-600/15"
              >
                Apply for Internship
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════
          4. SPONTANEOUS APPLICATION
      ═══════════════════════════════ */}
      <section>
        <motion.div
          {...fadeUp()}
          className="border-t border-slate-200 dark:border-slate-800 pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        >
          <div>
            <SectionLabel label="Don't see a fit?" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              Apply Speculatively
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md">
              We review every speculative application. If you're exceptional, we'll make a role for you.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="mailto:hr@pntsolution.in?subject=Spontaneous%20Application"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:border-blue-500 dark:hover:text-blue-400 dark:hover:bg-blue-900/10 transition-all duration-200"
            >
              <Send className="w-4 h-4" />
              Send Your CV
            </a>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
