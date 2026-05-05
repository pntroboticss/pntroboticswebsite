import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Coding & Robotics Classes for Kids | PNT Academy",
  description: "Free online AI & Robotics Bootcamps for students. Learn Python, block-coding, and circuitry simulations from home with PNT Academy.",
  alternates: {
    canonical: "/courses/online",
  },
};

export default function OnlineClassesPage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <PageHeader
                title="Online Classes & Bootcamps"
                subtitle="COURSES FOR KIDS"
                description="Free online AI & Robotics Bootcamps aimed at creating early awareness and deep interest in future technologies."
                colorFrom="from-emerald-400"
                colorTo="to-teal-500"
                actionText="Go to LMS Portal"
                actionLink="https://learn.pntacademy.com"
            />

            <section className="py-20 container mx-auto px-4 max-w-5xl">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center">
                    <h2 className="text-3xl font-bold mb-6">Learn from Anywhere</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                        PNT Academy conducts free online AI & Robotics sessions for students, integrating tools like Python, block-coding, and basic circuitry simulations to impart critical problem-solving skills right from home.
                    </p>
                    <div className="inline-block p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold">
                        New batch enrollments opening soon in our Learning Management System.
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
