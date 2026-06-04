import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InternshipForm from "./InternshipForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internship Application | PNT Robotics",
  description: "Apply for a year-round internship at PNT Robotics. Work on live robotics, AI, and embedded systems projects based on your area of interest.",
};

export default function InternshipPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-slate-900 dark:text-slate-50">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <InternshipForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
