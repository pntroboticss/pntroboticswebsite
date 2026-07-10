import ProductPortfolio from "@/components/ProductPortfolio";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import SectorHeroHeader from "@/components/SectorHeroHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Commercial Robots | PNT Robotics",
};

export default function CommercialProductsPage() {
  return (
    <div className="dark flex flex-col min-h-screen bg-[#0a0a0a] transition-colors duration-500 pt-20">
      <NetworkBackground />
      <Navbar />
      
      <SectorHeroHeader 
        title="Commercial Robots"
        description="Versatile robotic platforms designed for research, education, and commercial automation applications."
        accentColor="purple"
      />

      <ProductPortfolio fixedSectorId="commercial" />
      <Footer />
    </div>
  );
}
