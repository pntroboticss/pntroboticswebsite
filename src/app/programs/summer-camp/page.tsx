import { Metadata } from 'next';
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "Innovation Summer Camp",
    description: "Enroll in the PNT Academy Summer Camp. A high-energy learning experience building robots, programming AI, and creating smart IoT devices.",
};

import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export default function SummerCampPage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <PageHeader
                title="PNT Summer Camp"
                subtitle="VACATION LEARNING"
                description="Transform your summer break into an innovation journey. Build robots, learn Python, and fly drones."
                colorFrom="from-yellow-400"
                colorTo="to-orange-500"
            />

            <section className="py-20 container mx-auto px-4 max-w-5xl">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center">
                    <h2 className="text-3xl font-bold mb-6">Upcoming Camps</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Information regarding dates, locations, and registration for the upcoming Summer Camp batches will be announced here shortly. Stay tuned!
                    </p>
                </div>
            </section>
            <Footer />
        </main>
    );
}
