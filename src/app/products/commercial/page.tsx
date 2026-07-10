import ProductPortfolio from "@/components/ProductPortfolio";
import { ProductPortfolioErrorBoundary } from "@/components/ProductPortfolioWrapper";
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
    <div className="flex flex-col min-h-screen bg-transparent transition-colors duration-500 pt-20">
      <NetworkBackground />
      <Navbar />
      
      <SectorHeroHeader 
        title="Commercial Robots"
        description="Versatile robotic platforms designed for research, education, and commercial automation applications."
        accentColor="purple"
      />

      <ProductPortfolioErrorBoundary>
        <ProductPortfolio fixedSectorId="commercial" />
      </ProductPortfolioErrorBoundary>
      <Footer />
    </div>
  );
}
