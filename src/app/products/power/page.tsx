import ProductPortfolio from "@/components/ProductPortfolio";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import SectorHeroHeader from "@/components/SectorHeroHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industrial Automation & Power Products | PNT Robotics",
};

export default function PowerProductsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent transition-colors duration-500 pt-20">
      <NetworkBackground />
      <Navbar />
      
      <SectorHeroHeader 
        title="Industrial Automation & Power"
        description="Robust robotic solutions built for heavy industry, switchyard automation, and high-voltage environments."
        accentColor="yellow"
      />

      <ProductPortfolio fixedSectorId="industrial" />
      <Footer />
    </div>
  );
}
