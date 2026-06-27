import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutHero from "@/components/AboutHero";
import VisionMission from "@/components/VisionMission";
import StatsSection from "@/components/StatsSection";
import CompanyOverview from "@/components/CompanyOverview";
import EngineeringExcellence from "@/components/EngineeringExcellence";
import CallToAction from "@/components/CallToAction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | PNT Robotics",
  description: "Learn about PNT Robotics, our mission, achievements, and technical prowess in the field of AI and autonomous robotics.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen bg-transparent transition-colors duration-500 pt-20 bg-slate-950">
      
      {/* Navigation */}
      <Navbar />
      
      {/* 1. Stunning Custom Hero Section */}
      <AboutHero />

      {/* 2. Key Metrics & Stats (Floating over the transition) */}
      <div className="relative -mt-32 z-20 mb-8 max-w-7xl mx-auto px-4 w-full">
        <StatsSection />
      </div>

      {/* 3. Core Company Overview & Achievements (Shark Tank etc.) */}
      <div className="relative z-10 bg-slate-50 dark:bg-slate-950 -mt-24 pt-24">
          <CompanyOverview />
      </div>

      {/* 4. Vision & Mission Cards */}
      <VisionMission />

      {/* 5. Deep Dive into Technical Prowess */}
      <EngineeringExcellence />

      {/* 6. Big Call to Action at the bottom */}
      <CallToAction />

      {/* Footer */}
      <Footer />
    </main>
  );
}
