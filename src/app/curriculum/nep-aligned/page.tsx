import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEP 2020 Aligned Robotics Curriculum | PNT Academy",
  description: "Year-long Robotics, Coding, and AI curriculum focused on practical learning and 21st-century skills aligned with NEP 2020 guidelines.",
  alternates: {
    canonical: "/curriculum/nep-aligned",
  },
};

export default function NepAlignedPage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <PageHeader
                title="NEP 2020 Aligned Curriculum"
                subtitle="FOR GRADES 3 TO 10"
                description="Year-long Robotics Curriculum focused on practical learning, real-world projects, and 21st-century skill development."
                colorFrom="from-fuchsia-500"
                colorTo="to-purple-600"
            />

            <section className="py-20 container mx-auto px-4 max-w-5xl">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <h2 className="text-3xl font-bold mb-6">Structured, Graded Learning</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        Designed to introduce students to Robotics, Coding, AI, and emerging technologies beyond textbook learning, fulfilling the experiential education mandates of the National Education Policy (NEP) 2020.
                    </p>
                    <ul className="space-y-4 text-slate-700 dark:text-slate-300">
                        <li className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <span className="font-bold text-purple-500">Grades 3-5:</span>
                            <span>Logic building, drag-and-drop coding, and basic circuitry.</span>
                        </li>
                        <li className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <span className="font-bold text-purple-500">Grades 6-8:</span>
                            <span>Microcontrollers (Arduino), basic sensors, and autonomous mechanics.</span>
                        </li>
                        <li className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                            <span className="font-bold text-purple-500">Grades 9-10:</span>
                            <span>Python programming, IoT applications, and Artificial Intelligence prototyping.</span>
                        </li>
                    </ul>
                </div>
            </section>
            <Footer />
        </main>
    );
}
