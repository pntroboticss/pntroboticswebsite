import ProductPortfolio from "@/components/ProductPortfolio";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import SectorHeroHeader from "@/components/SectorHeroHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Power Industry Robots | PNT Robotics",
};

export default function PowerProductsPage() {
  return (
    <div className="dark flex flex-col min-h-screen bg-[#0a0a0a] transition-colors duration-500 pt-20">
      <NetworkBackground />
      <Navbar />
      
      <SectorHeroHeader 
        title="Power Industry Robots"
        description="Robust robotic solutions built for heavy industry, switchyard automation, and high-voltage environments."
        accentColor="yellow"
      />

      <ProductPortfolio fixedSectorId="power" />
      <Footer />
    </div>
  );
}
