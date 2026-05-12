import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Careers | PNT Robotics",
  description: "Join PNT Robotics and shape the future of AI and robotic automation. Explore full-time roles and internship opportunities.",
};

export const revalidate = 0;

const BENEFITS = [
  { title: "Cutting-Edge Tech", icon: "🚀", desc: "Work with the latest in robotics, AI, and autonomous systems." },
  { title: "Impactful Work", icon: "🌍", desc: "Build solutions for the Indian Army, Navy, and leading enterprises." },
  { title: "Continuous Growth", icon: "📈", desc: "Learn fast in a top startup environment with endless opportunities." },
  { title: "Health & Wellness", icon: "❤️", desc: "Comprehensive health coverage and flexible working arrangements." }
];

export default async function CareersPage() {
  const { data: OPEN_POSITIONS } = await supabase.from("job_postings").select("*").eq("is_active", true).order("created_at", { ascending: false });

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />

      <main className="flex-1 pb-16">

        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center pt-20 overflow-hidden mb-16 bg-slate-900 dark:bg-slate-950 border-b border-slate-800 shadow-2xl">
          <NetworkBackground />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 z-10 flex flex-col items-center text-center justify-center h-full gap-6 pb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider text-cyan-400 bg-cyan-900/30 border border-cyan-800/50 mt-12 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              Join Our Team
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white drop-shadow-sm max-w-5xl">
              Build the Future of <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Robotics & AI</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mt-2 font-medium">
              We are a collective of engineers, researchers, and creators dedicated to solving complex real-world problems with advanced robotics.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-6xl">

          {/* Benefits Section */}
          <section className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why Join PNT Robotics?</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {BENEFITS.map((benefit, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-slate-800 flex items-center justify-center text-2xl mb-4 border border-purple-100 dark:border-slate-700">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Open Positions Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Open Positions</h2>
              <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 py-1 px-3 rounded-full text-sm font-bold">
                {OPEN_POSITIONS?.length || 0} Roles
              </span>
            </div>

            <div className="grid gap-4">
              {OPEN_POSITIONS?.map((pos, idx) => (
                <div key={pos.id || idx} className="group bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{pos.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-1 px-2.5 rounded-lg">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {pos.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-1 px-2.5 rounded-lg">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {pos.location}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl line-clamp-2">{pos.description}</p>
                  </div>

                  <div className="shrink-0">
                    <Link href={`/careers/${pos.id}`} className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-colors w-full sm:w-auto">
                      Apply Now
                    </Link>
                  </div>
                </div>
              ))}

              {(!OPEN_POSITIONS || OPEN_POSITIONS.length === 0) && (
                <div className="text-center py-16 text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                  <p className="font-bold text-lg mb-1">No openings at the moment</p>
                  <p className="text-sm">Check back soon or apply for an internship below!</p>
                </div>
              )}
            </div>
          </section>

          {/* ===== INTERNSHIP BANNER ===== */}
          <section className="mb-24">
            <div className="relative overflow-hidden rounded-[2rem] border border-amber-200 dark:border-amber-800/40 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-slate-900 shadow-xl">
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
                {/* Icon / Badge */}
                <div className="shrink-0 flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/30">
                    🎓
                  </div>
                  <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700">
                    Year-Round
                  </span>
                </div>

                {/* Text */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3">
                    <span className="w-4 h-px bg-amber-400" />
                    Internship Programme
                    <span className="w-4 h-px bg-amber-400" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
                    Apply for an Internship
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-xl mb-1">
                    We accept interns <strong>year-round</strong>, based on your field of interest — Robotics, AI, Electronics, Software, Mechanical Design, and more. No fixed JD; you work on what excites you.
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-400 font-semibold">
                    ⚠️ This is an <strong>unpaid internship</strong>. Stipend may be provided based on performance and project contributions.
                  </p>
                </div>

                {/* CTA Button */}
                <div className="shrink-0">
                  <Link
                    href="/careers/internship"
                    className="inline-flex flex-col items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-lg shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-200 group"
                  >
                    <span>Apply for Internship</span>
                    <span className="text-[11px] font-normal text-amber-100 mt-0.5">Takes 5 minutes →</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2.5rem] p-10 sm:p-16 text-center text-white relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">Don't see a perfect fit?</h2>
              <p className="text-blue-100 text-lg mb-8">
                We're always looking for exceptionally talented individuals. Send us your resume and tell us how you can contribute to our mission.
              </p>
              <a href="mailto:hr@pntsolution.in?subject=Spontaneous%20Application" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-blue-600 font-bold hover:bg-slate-50 hover:scale-105 transition-all shadow-xl shadow-black/10">
                Send Spontaneous Application
              </a>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
