import ProductPortfolio from "@/components/ProductPortfolio";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import SectorHeroHeader from "@/components/SectorHeroHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Defence & Security Products | PNT Robotics",
};

export default function DefenceProductsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent transition-colors duration-500 pt-20">
      <NetworkBackground />
      <Navbar />
      
      <SectorHeroHeader 
        title="Defence & Security"
        description="Advanced robotic solutions designed for national security, precision operations, and situational awareness in critical environments."
        accentColor="red"
      />

      <ProductPortfolio fixedSectorId="defense" />
      <Footer />
    </div>
  );
}
