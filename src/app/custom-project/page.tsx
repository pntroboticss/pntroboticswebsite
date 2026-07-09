import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomProjectForm from "@/components/CustomProjectForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Start a Custom Project | PNT Robotics",
    description: "Submit a request for a custom industrial automation, robotics, or AGV project.",
};

export default function CustomProjectPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            <Navbar />
            
            {/* Header Spacer */}
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">
                        Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">vision.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Whether it's a custom robotic arm, an autonomous vehicle, or specialized automation software, our engineering team is ready to bring your idea to life.
                    </p>
                </div>
            </div>

            {/* Form Section */}
            <section className="pb-24">
                <div className="container mx-auto px-4">
                    <CustomProjectForm />
                </div>
            </section>

            <Footer />
        </main>
    );
}
