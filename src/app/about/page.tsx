import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectorHeroHeader from "@/components/SectorHeroHeader";
import NetworkBackground from "@/components/NetworkBackground";
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
    <main className="flex flex-col min-h-screen bg-transparent transition-colors duration-500 pt-20">
      {/* Background Effect */}
      <NetworkBackground />
      
      {/* Navigation */}
      <Navbar />
      
      {/* 1. Stunning Hero Section */}
      <SectorHeroHeader 
        title="About PNT Robotics"
        description="We are recognized leaders in robotics and automation, dedicated to solving complex real-world operational challenges with cutting-edge AI and hardware systems."
        accentColor="cyan"
      />

      {/* 2. Key Metrics & Stats */}
      <div className="relative -mt-10 z-10 mb-16">
        <StatsSection />
      </div>

      {/* 3. Core Company Overview & Achievements (Shark Tank etc.) */}
      <CompanyOverview />

      {/* 4. Deep Dive into Technical Prowess */}
      <EngineeringExcellence />

      {/* 5. Big Call to Action at the bottom */}
      <CallToAction />

      {/* Footer */}
      <Footer />
    </main>
  );
}
