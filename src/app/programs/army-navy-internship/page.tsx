import { Metadata } from 'next';
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "Defense R&D Internship",
    description: "Join the elite PNT Academy Defense R&D Internship. Work on real-world military-grade robotics, drone technology, and defense automation.",
};

import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export default function DefenseInternshipPage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <PageHeader
                title="Defense R&D Internship"
                subtitle="INDIAN NAVY'S PROJECT 'KAVACH'"
                description="A 1-month guided online internship where students solve real-world defense challenges alongside PNT Academy engineers."
                colorFrom="from-slate-700"
                colorTo="to-slate-900"
            />

            <section className="py-20 container mx-auto px-4 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl font-bold mb-6">Real-World Engineering</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            Students gain exposure to applied engineering concepts under expert mentorship from our sister company, PNT Robotics, directly based on our ongoing industrial deployments with the Indian Armed Forces.
                        </p>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 mt-8">
                            <h3 className="font-bold text-xl mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">Top Performer Perks</h3>
                            <ul className="space-y-2 text-slate-700 dark:text-slate-300 mt-4">
                                <li>✨ Industrial Visit to PNT Robotics in Mumbai</li>
                                <li>✨ Professional Letter of Recommendation (LOR)</li>
                                <li>✨ Live Project Deployment Experience</li>
                            </ul>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 overflow-hidden">
                            [Indian Navy Project Photo]
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
