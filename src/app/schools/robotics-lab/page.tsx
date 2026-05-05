import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoboticsLabContent from "@/components/RoboticsLabContent";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "School Robotics Lab Setup | PNT Academy",
  description: "Bring the future of education to your school with PNT Academy's end-to-end Robotics Lab setups. Learn 3D printing, IoT, robotics, and humanoid tech.",
  alternates: {
    canonical: "/schools/robotics-lab",
  },
};

export default async function RoboticsLabPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const tab = typeof params.tab === 'string' ? params.tab : "schools";
    
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500">
            <Navbar />
            <RoboticsLabContent initialTab={tab as "schools" | "colleges"} />
            <Footer />
        </main>
    );
}
