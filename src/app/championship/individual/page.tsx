import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChampionshipContent from "@/components/ChampionshipContent";
import AdminSettings from "@/lib/models/AdminSettings";
import connectMongo from "@/lib/mongodb";
import type { Metadata } from "next";

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;

export const metadata: Metadata = {
  title: `Individual Registration | Skill Tank ${currentYear}-${nextYear} | PNT Academy`,
  description: "Join Skill Tank as an individual student. The ultimate robotics and innovation championship for independent innovators to showcase STEM problem-solving skills.",
  keywords: ["Skill Tank Individual", "Robotics Championship", "Student Registration", "STEM Innovation", "PNT Academy Event", "Solo Robotics", "Kids AI Championship"],
  openGraph: {
    title: `Individual Student Registration | Skill Tank ${currentYear}-${nextYear}`,
    description: "Participate solo or with friends in the ultimate robotics and innovation championship. Showcase your STEM skills today.",
    url: "https://pntacademy.com/championship/individual",
    type: "website",
    siteName: "PNT Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: `Individual Student Registration | Skill Tank ${currentYear}-${nextYear}`,
    description: "Register as an individual student for the ultimate robotics and innovation championship.",
  },
  alternates: {
    canonical: "/championship/individual",
  },
};

export default async function IndividualChampionshipPage() {
    await connectMongo();
    const settings = await AdminSettings.findOne({});
    const formLink = settings?.individualChampionshipLink || settings?.roboticsChampionshipLink || "mailto:Contact@pntacademy.com";

    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden bg-white dark:bg-[#020617] selection:bg-blue-600 selection:text-white transition-colors duration-500">
            <Navbar />
            
            <ChampionshipContent isIndividual={true} registrationLink={formLink} />
            
            <Footer />
        </main>
    );
}
