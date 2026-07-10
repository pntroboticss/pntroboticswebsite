import ProductPortfolio from "@/components/ProductPortfolio";
import { ProductPortfolioErrorBoundary } from "@/components/ProductPortfolioWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import SectorHeroHeader from "@/components/SectorHeroHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products for Defence | PNT Robotics",
};

export default function DefenceProductsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent transition-colors duration-500 pt-20">
      <NetworkBackground />
      <Navbar />
      
      <SectorHeroHeader 
        title="Products for Defence"
        description="Advanced robotic solutions designed for national security, precision operations, and situational awareness in critical environments."
        accentColor="red"
      />

      <ProductPortfolioErrorBoundary>
        <ProductPortfolio fixedSectorId="defence" />
      </ProductPortfolioErrorBoundary>
      <Footer />
    </div>
  );
}
