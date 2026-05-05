import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline Robotics Bootcamps | PNT Academy",
  description: "Intensive multi-day coding and robotics bootcamps. Build physical prototypes, wire sensors, and learn Python with PNT Engineers.",
  alternates: {
    canonical: "/courses/offline-bootcamps",
  },
};

export default function OfflineBootcampsPage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <PageHeader
                title="Bootcamps"
                subtitle="INTENSIVE HANDS-ON LEARNING"
                description="Engage in immersive, multi-day coding and robotics bootcamps where students build physical prototypes alongside industry experts."
                colorFrom="from-orange-400"
                colorTo="to-red-500"
            />

            <section className="py-20 container mx-auto px-4 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <div className="w-full h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400">
                            [Bootcamp Action Photo]
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <h2 className="text-3xl font-bold mb-6">Real Hardware, Real Code</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            Our Bootcamps bring the PNT Industrial Robotics experience directly to the students. Over a series of immersive sessions, attendees assemble microcontrollers, wire sensors, and write the Python logic to make their autonomous projects come to life.
                        </p>
                        <ul className="space-y-3 font-medium text-slate-700 dark:text-slate-300">
                            <li>🔥 Take-away hardware kits</li>
                            <li>🔥 Mentorship from PNT Engineers</li>
                            <li>🔥 Certificate of Completion</li>
                        </ul>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
