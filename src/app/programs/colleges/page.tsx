import { Metadata } from 'next';
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "Engineering Colleges & Industrial Robotics Training",
    description: "Advanced Robotics, IoT, and Next-Gen Automation labs designed specifically for Engineering Colleges. Real-world projects & internships.",
};

import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import ClientOnly from "@/components/ClientOnly";
import CollegesTrainingContent from "@/components/CollegesTrainingContent";
import HeroRotatingFrames from "@/components/HeroRotatingFrames";
import dbConnect from "@/lib/mongodb";
import Testimonial from "@/lib/models/Testimonial";
import LabPartner from "@/lib/models/LabPartner";

export const revalidate = 60; // Revalidate every minute for fresh data

export default async function CollegesProgramsPage() {
    await dbConnect();

    // Fetch college testimonials
    const testimonialsRaw = await Testimonial.find({ page: "college" }).sort({ createdAt: -1 });
    const testimonials = JSON.parse(JSON.stringify(testimonialsRaw));

    // Fetch lab partners for the rolling logo section
    const labPartnersRaw = await LabPartner.find({}).sort({ sortOrder: 1, createdAt: 1 });
    const labPartners = JSON.parse(JSON.stringify(labPartnersRaw));

    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Navbar />

            {/* Custom Hero Section for Colleges */}
            <section className="relative pt-32 pb-20 min-h-[60vh] flex flex-col justify-center border-b border-slate-200 dark:border-slate-800">
                {/* Background Animation */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <ClientOnly>
                        <NetworkBackground />
                    </ClientOnly>
                </div>
                {/* Gradient Overlays for Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 to-slate-100/80 dark:from-slate-900/90 dark:to-slate-950/80 z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-700 opacity-5 dark:opacity-10 z-0"></div>

                <div className="container mx-auto px-4 z-10 relative">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        {/* Left Side: Content */}
                        <div className="w-full lg:w-1/2">
                            <div className="inline-block px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
                                <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-700">
                                    ENGINEERING &amp; DIPLOMA
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-8 leading-tight">
                                Industrial Trainings for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Colleges</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mb-10 border-l-4 border-indigo-500 pl-6">
                                Research-Enabled Industrial Automation Labs. Partnering with Indian Navy, DRDO, and TATA Power to offer real-world exposure and bridge the academic gap.
                            </p>
                        </div>
                        
                        {/* Right Side: Visual/Image Rotating Frames */}
                        <div className="w-full lg:w-1/2 relative z-20">
                            <HeroRotatingFrames />
                        </div>
                    </div>
                </div>
            </section>

            <CollegesTrainingContent testimonials={testimonials} labPartners={labPartners} />
            <Footer />
        </main>
    );
}