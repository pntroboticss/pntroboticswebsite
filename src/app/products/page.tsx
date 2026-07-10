import ProductPortfolio from "@/components/ProductPortfolio";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import SectorHeroHeader from "@/components/SectorHeroHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | PNT Robotics",
};

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent transition-colors duration-500 pt-20">
      <NetworkBackground />
      <Navbar />
      
      <SectorHeroHeader 
        title="All Products"
        description="Explore our full catalog of cutting-edge robotic solutions, designed to revolutionize industries from Healthcare to Defense."
        accentColor="cyan"
      />

      <ProductPortfolio />
      <Footer />
    </div>
  );
}
