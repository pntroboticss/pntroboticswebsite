import Image from "next/image";
import { CheckCircle2, Award, Tv, ShieldCheck } from "lucide-react";

const SPECIALTIES = [
    "Artificial Intelligence (AI)", "Robotics", "Machine Learning", 
    "Internet of Things (IoT)", "Human-Computer Interaction", 
    "Software Development", "Sensor Fusion", "Autonomous Navigation", 
    "Data Science & Analytics"
];

export default function CompanyOverview() {
    return (
        <section className="w-full py-24 bg-white dark:bg-slate-950 transition-colors duration-500 border-t border-slate-100 dark:border-slate-900">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Left Side: Text Overview */}
                <div className="flex flex-col">
                    <h3 className="text-cyan-600 dark:text-cyan-400 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                        <span className="w-8 h-px bg-cyan-600 dark:bg-cyan-400" />
                        About Us & Achievements
                    </h3>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight mb-8">
                        Recognized Leaders in Robotics & Automation.
                    </h2>
                    
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        PNT Robotics is a premier manufacturing and R&D startup dedicated to solving real-world operational challenges. We specialize in deploying intelligent automation systems that transform how modern industries operate.
                    </p>

                    <div className="mb-10">
                        <h4 className="text-slate-900 dark:text-white font-bold mb-4 text-lg">Our Core Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                            {SPECIALTIES.map(spec => (
                                <span key={spec} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-800">
                                    <CheckCircle2 size={14} className="text-cyan-500" />
                                    {spec}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Achievements Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Achievement 1 */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-start gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                            <Award size={28} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Top 100 Startups</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Officially recognized and featured among Maharashtra's top 100 startups.</p>
                        </div>
                    </div>

                    {/* Achievement 2 */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-start gap-4 sm:translate-y-8">
                        <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-2xl">
                            <Tv size={28} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Shark Tank India</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Featured on Shark Tank India out of 65,000 entries and successfully secured funding from Lenskart.</p>
                        </div>
                    </div>

                    {/* Achievement 3 */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-start gap-4 sm:col-span-2">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Government Memberships</h4>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">Proud members of the Government e-Marketplace (GeM) and the Central Public Procurement Portal of the Government of India (CPPP).</p>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
