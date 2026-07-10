import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import SectorHeroHeader from "@/components/SectorHeroHeader";
import ServicesList from "@/components/ServicesList";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Services | PNT Robotics",
  description: "Explore our specialized robotics services, including installation, maintenance, training, and custom engineering.",
};

// Next.js Revalidate setup (ISR)
export const revalidate = 3600; // Revalidate every hour

async function getServices() {
    const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching services:", error);
        return [];
    }

    return data || [];
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="flex flex-col min-h-screen bg-transparent transition-colors duration-500 pt-20">
      <NetworkBackground />
      <Navbar />
      
      <SectorHeroHeader 
        title="Our Services"
        description="Comprehensive robotics services from deployment and integration to long-term maintenance and specialized training."
        accentColor="cyan"
      />

      <div className="relative w-full min-h-[60vh] bg-slate-50 dark:bg-[#0A0A0B] overflow-hidden">
        {/* Background Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-[size:64px_64px] bg-[position:32px_32px] pointer-events-none z-0" />
        
        {/* 3D Animated Services List */}
        <ServicesList services={services} />
      </div>

      <Footer />
    </div>
  );
}
