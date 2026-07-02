"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const BENEFITS = [
  { title: "Cutting-Edge Tech", icon: "🚀", desc: "Work with the latest in robotics, AI, and autonomous systems." },
  { title: "Impactful Work", icon: "🌍", desc: "Build solutions for the Indian Army, Navy, and leading enterprises." },
  { title: "Continuous Growth", icon: "📈", desc: "Learn fast in a top startup environment with endless opportunities." },
  { title: "Health & Wellness", icon: "❤️", desc: "Comprehensive health coverage and flexible working arrangements." }
];

export default function CareersAnimatedSections({ openPositions }: { openPositions: any[] }) {
  return (
    <>
      {/* Benefits Section */}
      <section className="mb-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Why Join PNT Robotics?</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BENEFITS.map((benefit, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              className="relative group h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-[2rem] transform group-hover:scale-[1.03] transition-transform duration-500" />
              <div className="relative bg-white/60 dark:bg-slate-900/60 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md hover:shadow-xl transition-all h-full flex flex-col items-start">
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center text-3xl mb-6 border border-cyan-100 dark:border-cyan-800 shadow-inner">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{benefit.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="mb-24 relative z-10">
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Open Positions</h2>
          <span className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 py-1.5 px-4 rounded-full text-sm font-bold shadow-sm">
            {openPositions?.length || 0} Roles
          </span>
        </div>

        <div className="grid gap-6">
          {openPositions?.map((pos, idx) => (
            <motion.div 
              key={pos.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-cyan-500/0 to-cyan-500/0 group-hover:from-blue-600/5 group-hover:via-cyan-500/5 group-hover:to-cyan-500/5 rounded-3xl transition-all duration-500" />
              <div className="relative bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group-hover:shadow-2xl group-hover:border-cyan-500/30 transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transform group-hover:-translate-y-1">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{pos.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-600 dark:text-slate-300 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {pos.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-600 dark:text-slate-300 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {pos.location}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl line-clamp-2 leading-relaxed">{pos.description}</p>
                </div>

                <div className="shrink-0 relative z-20">
                  <Link href={`/careers/${pos.id}`} className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-cyan-600 dark:hover:bg-cyan-500 hover:text-white transition-colors w-full sm:w-auto shadow-lg hover:shadow-cyan-500/25">
                    Apply Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}

          {(!openPositions || openPositions.length === 0) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl"
            >
              <p className="font-bold text-xl mb-2 text-slate-700 dark:text-slate-300">No openings at the moment</p>
              <p className="text-sm">Check back soon or apply for an internship below!</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== INTERNSHIP BANNER ===== */}
      <section className="mb-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[3rem] border border-cyan-200/50 dark:border-cyan-800/40 bg-gradient-to-br from-cyan-50 via-blue-50 to-slate-50 dark:from-cyan-950/30 dark:via-blue-900/20 dark:to-slate-900 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 p-10 md:p-16">
            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-5xl shadow-xl shadow-cyan-500/30 border border-white/20">
                🎓
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                Internship Openings
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl leading-relaxed">
                Kickstart your career in advanced robotics. Work on real-world military and industrial projects.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/careers/internship"
                className="inline-flex flex-col items-center justify-center px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xl shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300"
              >
                Apply for Internship
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-blue-950 dark:to-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden mb-12 shadow-2xl border border-slate-700/50">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-cyan-500/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Don't see a perfect fit?</h2>
          <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed font-light">
            We're always looking for exceptionally talented individuals. Send us your resume and tell us how you can contribute to our mission in robotics and AI.
          </p>
          <a href="mailto:hr@pntsolution.in?subject=Spontaneous%20Application" className="inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-white text-slate-900 font-black hover:bg-cyan-50 hover:scale-105 transition-all shadow-2xl shadow-black/20">
            Send Spontaneous Application
          </a>
        </div>
      </section>
    </>
  );
}
