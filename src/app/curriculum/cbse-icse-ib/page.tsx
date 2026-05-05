import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CBSE / ICSE / IB Robotics Syllabus Integration | PNT Academy",
  description: "Supplementary robotics curriculum maps tailored to support computer science and physics syllabi for CBSE, ICSE, and IB boards.",
  alternates: {
    canonical: "/curriculum/cbse-icse-ib",
  },
};

export default function CbseIcsePage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <PageHeader
                title="CBSE / ICSE / IB Support"
                subtitle="BOARD-SPECIFIC INTEGRATION"
                description="Supplementary curriculum maps tailored to support the specific computer science and physics syllabi of major educational boards."
                colorFrom="from-sky-400"
                colorTo="to-blue-600"
            />

            <section className="py-20 container mx-auto px-4 max-w-5xl">
                <div className="text-center bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <h2 className="text-3xl font-bold mb-6">Syllabus Enhancement</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        We map our physical robotics projects directly to the theoretical concepts taught in Science and Math classes, ensuring that hands-on learning reinforces academic performance across CBSE, ICSE, and IB frameworks.
                    </p>
                </div>
            </section>
            <Footer />
        </main>
    );
}
