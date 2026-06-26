import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

import HomeHeroSlider from "@/components/HomeHeroSlider";
import TrustedClients from "@/components/TrustedClients";
import CompanyOverview from "@/components/CompanyOverview";
import HomeIdeaBanner from "@/components/HomeIdeaBanner";
import EngineeringExcellence from "@/components/EngineeringExcellence";
import StatsSection from "@/components/StatsSection";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "PNT Robotics & Automation Solutions LLP | Engineering the future",
  description: "Making human life simpler & safe with our robotic solutions.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500">
      <div className="relative flex flex-col min-h-screen w-full z-10">
        
        <Navbar />

        {/* 1. Hero Section Slider */}
        <HomeHeroSlider />
        
        {/* 2. Key Metrics & Stats */}
        <div className="relative z-10 -mt-12 mb-12">
            <StatsSection />
        </div>

        {/* 3. About Us & Achievements */}
        <CompanyOverview />
        
        {/* 4. Deep Dive into Technical Prowess */}
        <EngineeringExcellence />

        {/* 5. Trusted Clientele */}
        <TrustedClients />
        
        {/* 4. Testimonials */}
        <Testimonials />

        {/* 5. Custom Idea Banner */}
        <HomeIdeaBanner />

        {/* 6. Footer & Contact */}
        <Footer />
        
      </div>
    </main>
  );
}
