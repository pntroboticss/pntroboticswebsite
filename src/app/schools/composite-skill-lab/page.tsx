import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Composite Skill Lab | Innovation Centers by PNT Academy",
  description: "Comprehensive multi-disciplinary innovation centers combining 3D Printing, IoT, AR/VR, and core mechanical automation for schools and colleges.",
  alternates: {
    canonical: "/schools/composite-skill-lab",
  },
};

export default function CompositeSkillLabPage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <PageHeader
                title="Composite Skill Lab"
                subtitle="INNOVATION SPACES"
                description="Comprehensive multi-disciplinary innovation centers combining 3D Printing, IoT, AR/VR, and core mechanical automation."
                colorFrom="from-purple-500"
                colorTo="to-pink-600"
            />

            <section className="py-20 container mx-auto px-4 max-w-6xl">
                <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black mb-6">Composite Skill Lab Integration</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Combining 3D Printing, IoT, AR/VR, and core mechanical automation into a unified, research-grade facility.
                        </p>
                    </div>

                    <div className="flex flex-col gap-12 items-center">
                        {Array.from({ length: 21 }, (_, i) => i + 1).map((num) => (
                            <div key={num} className="w-full relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transition-transform hover:scale-[1.01]">
                                <img
                                    src={`/images/robotics-lab/${num}.jpg`}
                                    alt={`Composite Skill Lab Slide ${num}`}
                                    className="w-full h-auto object-cover"
                                    loading={num < 3 ? "eager" : "lazy"}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
