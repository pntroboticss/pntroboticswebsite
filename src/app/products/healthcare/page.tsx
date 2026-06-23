import ProductPortfolio from "@/components/ProductPortfolio";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import SectorHeroHeader from "@/components/SectorHeroHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Healthcare & Medical Products | PNT Robotics",
};

export default function HealthcareProductsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent transition-colors duration-500 pt-20">
      <NetworkBackground />
      <Navbar />
      
      <SectorHeroHeader 
        title="Healthcare & Medical"
        description="Innovative robotics engineered to assist frontline workers, improve patient care, and streamline medical logistics."
        accentColor="green"
      />

      <ProductPortfolio fixedSectorId="healthcare" />
      <Footer />
    </div>
  );
}
