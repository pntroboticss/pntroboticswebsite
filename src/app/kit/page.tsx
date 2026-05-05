import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export default function KitsPage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <PageHeader
                title="Educational Robotics Kits"
                subtitle="HANDS-ON HARDWARE"
                description="Take-home physical hardware kits used during our bootcamps and workshops to ensure learning continues."
                colorFrom="from-cyan-400"
                colorTo="to-blue-500"
            />

            <section className="py-20 container mx-auto px-4 max-w-5xl">
                <div className="text-center bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <h2 className="text-3xl font-bold mb-6">Build Your Own Robot</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Rather than relying solely on simulations, PNT Academy provides students with physical microcontroller sets, sensors, jumper wires, and chassis components. These kits empower students to build real hardware interfaces and program autonomous behaviors.
                    </p>
                </div>
            </section>
            <Footer />
        </main>
    );
}
