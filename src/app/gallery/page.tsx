import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import SectorHeroHeader from "@/components/SectorHeroHeader";
import GalleryGrid from "@/components/GalleryGrid";
import { supabase } from "@/lib/supabase";
import { unstable_noStore as noStore } from 'next/cache';

export const metadata: Metadata = {
  title: "Gallery | PNT Robotics",
  description: "View our gallery of autonomous mobile robots, remotely operated vehicles, and advanced robotics in action.",
};

// Force dynamic rendering so new images show up immediately
export const dynamic = "force-dynamic";

async function getGallery() {
    noStore(); // Completely disable caching for this function
    const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching gallery:", error);
        return [];
    }

    return data || [];
}

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <div className="flex flex-col min-h-screen bg-transparent transition-colors duration-500 pt-20">
      <NetworkBackground />
      <Navbar />
      
      <SectorHeroHeader 
        title="Our Gallery"
        description="A visual showcase of our cutting-edge robotics solutions in action, from robust base platforms to fully customized automated systems."
        accentColor="purple"
      />

      <div className="relative w-full min-h-[60vh] bg-slate-50 dark:bg-[#0A0A0B] overflow-hidden">
        {/* Background Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-[size:64px_64px] bg-[position:32px_32px] pointer-events-none z-0" />
        
        {/* Gallery Grid */}
        <GalleryGrid items={items} />
      </div>

      <Footer />
    </div>
  );
}
