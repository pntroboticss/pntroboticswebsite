import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export default function WorkshopPage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <PageHeader
                title="Future Skills Workshop"
                subtitle="2-DAY INTENSIVE TRAINING"
                description="Designed to introduce students to practical technology learning, problem-solving, and innovation."
                colorFrom="from-rose-400"
                colorTo="to-red-600"
            />

            <section className="py-20 container mx-auto px-4 max-w-5xl">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <h2 className="text-3xl font-bold mb-6">Choose from 15+ Modules</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        Schools can choose a topic from our engaging robotics modules, and the selected workshop is conducted through guided, activity-based sessions right on your campus.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {['3D Printing', 'Android App Dev', 'Mobi-Robotics', 'Chat GPT', 'Smart Farming', 'Industrial Robotic Arm'].map(module => (
                            <div key={module} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
                                {module}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
