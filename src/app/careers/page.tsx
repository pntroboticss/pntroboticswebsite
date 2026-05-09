import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | PNT Robotics",
  description: "Join PNT Robotics and shape the future of AI and robotic automation.",
};

const OPEN_POSITIONS = [
  {
    title: "Robotics Engineer",
    type: "Full-Time",
    location: "Dombivli, Maharashtra",
    desc: "Design and implement autonomous navigation systems for our AGVs and defense robots.",
  },
  {
    title: "AI/ML Researcher",
    type: "Full-Time",
    location: "Dombivli, Maharashtra",
    desc: "Develop cutting-edge computer vision and sensor fusion models for complex industrial environments.",
  },
  {
    title: "Embedded Systems Engineer",
    type: "Full-Time",
    location: "Dombivli, Maharashtra",
    desc: "Program microcontrollers and design PCBs for our custom robotic manipulators.",
  },
  {
    title: "Full Stack Developer",
    type: "Full-Time",
    location: "Dombivli, Maharashtra",
    desc: "Build web dashboards and internal tools for robot fleet management and data visualization.",
  }
];

const BENEFITS = [
  { title: "Cutting-Edge Tech", icon: "🚀", desc: "Work with the latest in robotics, AI, and autonomous systems." },
  { title: "Impactful Work", icon: "🌍", desc: "Build solutions for the Indian Army, Navy, and leading enterprises." },
  { title: "Continuous Growth", icon: "📈", desc: "Learn fast in a Top 100 startup environment with endless opportunities." },
  { title: "Health & Wellness", icon: "❤️", desc: "Comprehensive health coverage and flexible working arrangements." }
];

export default function CareersPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/50 mb-6">
              Join Our Team
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-slate-900 dark:text-white">
              Build the Future of <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Robotics & AI</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We are a collective of engineers, researchers, and creators dedicated to solving complex real-world problems with advanced robotics.
            </p>
          </div>

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
          <section className="mb-24">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Open Positions</h2>
              <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 py-1 px-3 rounded-full text-sm font-bold">
                {OPEN_POSITIONS.length} Roles
              </span>
            </div>
            
            <div className="grid gap-4">
              {OPEN_POSITIONS.map((pos, idx) => (
                <div key={idx} className="group bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
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
                    <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">{pos.desc}</p>
                  </div>
                  
                  <div className="shrink-0">
                    <a href="mailto:pratik@pntsolutions.in?subject=Application%20for%20Position" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-colors w-full sm:w-auto">
                      Apply Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2.5rem] p-10 sm:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">Don't see a perfect fit?</h2>
              <p className="text-blue-100 text-lg mb-8">
                We're always looking for exceptionally talented individuals. Send us your resume and tell us how you can contribute to our mission.
              </p>
              <a href="mailto:pratik@pntsolutions.in?subject=Spontaneous%20Application" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-blue-600 font-bold hover:bg-slate-50 hover:scale-105 transition-all shadow-xl shadow-black/10">
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
