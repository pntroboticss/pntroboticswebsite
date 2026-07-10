import ProductPortfolio from "@/components/ProductPortfolio";
import { ProductPortfolioErrorBoundary } from "@/components/ProductPortfolioWrapper";
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
    <div className="flex flex-col min-h-screen bg-transparent transition-colors duration-500 pt-20">
      <NetworkBackground />
      <Navbar />
      
      <SectorHeroHeader 
        title="Power Industry Robots"
        description="Robust robotic solutions built for heavy industry, switchyard automation, and high-voltage environments."
        accentColor="yellow"
      />

      <ProductPortfolioErrorBoundary>
        <ProductPortfolio fixedSectorId="power" />
      </ProductPortfolioErrorBoundary>
      <Footer />
    </div>
  );
}
