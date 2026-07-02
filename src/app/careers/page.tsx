import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import CareersHero from "@/components/CareersHero";
import CareersAnimatedSections from "@/components/CareersAnimatedSections";

export const metadata: Metadata = {
  title: "Careers | PNT Robotics",
  description: "Join PNT Robotics and shape the future of AI and robotic automation. Explore full-time roles and internship opportunities.",
};

export const revalidate = 0;

export default async function CareersPage() {
  const { data: OPEN_POSITIONS } = await supabase
    .from("job_postings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-slate-900 dark:text-slate-50">
      <Navbar />

      <main className="flex-1 pb-16">
        <CareersHero />

        <div className="container mx-auto px-4 max-w-6xl mt-4">
          <CareersAnimatedSections openPositions={OPEN_POSITIONS ?? []} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
