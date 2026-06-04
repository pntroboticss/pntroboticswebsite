import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EngineeringExcellence from "@/components/EngineeringExcellence";
import Testimonials from "@/components/Testimonials";
import dynamic from "next/dynamic";
import type { Metadata } from "next";

import HeroSection from "@/components/HeroSection";

export const metadata: Metadata = {
  title: "PNT Robotics | Engineering the future",
  description: "Engineering the future of robotics and automation systems. Custom hardware and software solutions.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main className="relative min-h-screen bg-transparent text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500">
      <div className="relative flex flex-col min-h-screen">
        <Navbar />

        <HeroSection />

        <EngineeringExcellence />

        <Testimonials />

        <Footer />
      </div>
    </main>
  );
}
