import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import CareersAnimatedSections from "@/components/CareersAnimatedSections";

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
    <div className="relative min-h-screen flex flex-col bg-transparent text-slate-900 dark:text-slate-50">
      <Navbar />

      <main className="flex-1 pb-16">

        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center pt-20 overflow-x-hidden mb-16 bg-transparent">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 z-10 flex flex-col items-center text-center justify-center h-full gap-6 pb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider text-cyan-400 bg-cyan-900/30 border border-cyan-800/50 mt-12 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              Join Our Team
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm max-w-5xl">
              Build the Future of <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Robotics & AI</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mt-2 font-medium">
              We are a collective of engineers, researchers, and creators dedicated to solving complex real-world problems with advanced robotics.
            </p>
          </div>
        </section>

        {/* Application Status Checker CTA */}
        <div className="py-6">
          <div className="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              📋 Already applied? <span className="text-slate-900 dark:text-slate-300 font-medium">Track your application status in seconds.</span>
            </p>
            <Link
              href="/careers/status"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-full transition-all whitespace-nowrap"
            >
              Check Status →
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-6xl mt-12">
          <CareersAnimatedSections openPositions={OPEN_POSITIONS} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
