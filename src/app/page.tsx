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
import ProductPortfolio from "@/components/ProductPortfolio";
import VisionMission from "@/components/VisionMission";

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
        
        {/* 2. Key Metrics & Stats (Floating overlap) */}
        <div className="relative z-20 -mt-32 mb-12 px-4 max-w-7xl mx-auto w-full">
            <StatsSection />
        </div>

        {/* 3. Product Portfolio */}
        <div className="relative z-10">
            <ProductPortfolio />
        </div>

        {/* 4. About Us & Achievements */}
        <div id="about" className="relative z-10 scroll-mt-24">
            <CompanyOverview />
        </div>
        
        {/* 5. Vision & Mission */}
        <VisionMission />

        {/* 6. Deep Dive into Technical Prowess */}
        <EngineeringExcellence />

        {/* 7. Trusted Clientele */}
        <TrustedClients />
        
        {/* 8. Testimonials */}
        <Testimonials />

        {/* 9. Custom Idea Banner */}
        <HomeIdeaBanner />

        {/* 10. Footer & Contact */}
        <Footer />
        
      </div>
    </main>
  );
}
