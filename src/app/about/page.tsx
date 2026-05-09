import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us | PNT Robotics",
  description: "Learn about PNT Robotics, a top 100 startup in Maharashtra specializing in AI, Robotics, and Defense Solutions.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              About PNT Robotics
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              We are an innovative robotics and AI company recognized among the top 100 startups in Maharashtra, proudly serving as registered GeM and CPPP members.
            </p>
          </div>

          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 border-b pb-4 border-slate-200 dark:border-slate-800">Company Overview</h2>
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                PNT Robotics is dedicated to making human life simpler and safer. Through deep research and development, we create sophisticated robotic solutions for industrial automation, defense, and healthcare. Our recognition includes being funded by Lenskart on Shark Tank India, being appreciated by PM Shri Narendra Modi, and standing strong as a Top 100 Startup in Maharashtra.
              </p>
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 border-b pb-4 border-slate-200 dark:border-slate-800">Core Competencies</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "AI & Machine Learning",
                "Robotics",
                "IoT Solutions",
                "Human-Computer Interaction",
                "Software Development",
                "Sensor Fusion",
                "Autonomous Navigation",
                "Data Science"
              ].map((skill, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{skill}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 border-b pb-4 border-slate-200 dark:border-slate-800">Leadership Team</h2>
            <div className="max-w-sm group">
              <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -inset-x-20 -top-20 h-40 bg-gradient-to-r from-blue-600 to-cyan-500 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-2xl overflow-hidden shadow-xl shadow-blue-500/20 ring-4 ring-white dark:ring-slate-800 group-hover:scale-105 transition-transform duration-500 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {/* Placeholder for actual image */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-500 opacity-20" />
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-medium text-center px-4 relative z-10">
                    Add public/images/team/pratik-tirodkar.jpg
                  </span>
                  {/* Uncomment below when image is added */}
                  {/* <Image src="/images/team/pratik-tirodkar.jpg" alt="Pratik Tirodkar" fill className="object-cover" /> */}
                </div>
                
                <div className="text-center relative z-10">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    Pratik Tirodkar
                  </h3>
                  <p className="text-blue-600 dark:text-cyan-400 font-bold mb-6 uppercase tracking-widest text-xs">
                    Founder & CEO
                  </p>
                </div>
                
                <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/80 relative z-10">
                  {[
                    "BE Instrumentation",
                    "PG IMT Ghaziabad",
                    "Global MBA Deakin Australia"
                  ].map((cred, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm group/item">
                      <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0 group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-900/40 transition-colors">
                        <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="font-medium">{cred}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
