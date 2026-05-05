import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChampionshipContent from "@/components/ChampionshipContent";
import AdminSettings from "@/lib/models/AdminSettings";
import connectMongo from "@/lib/mongodb";
import type { Metadata } from "next";

const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;

export const metadata: Metadata = {
  title: `Skill Tank ${currentYear}-${nextYear} | Inter-School Robotics Championship | PNT Academy`,
  description: `Join Skill Tank ${currentYear}, the ultimate inter-school robotics and innovation championship. Build, present, and showcase your STEM problem-solving skills to industry experts.`,
  keywords: [`Skill Tank ${currentYear}`, "Robotics Championship", "School Robotics Championship", "STEM Innovation", "PNT Academy Event", "National Robotics Championship", "Robotics for Kids", "AI Championship"],
  openGraph: {
    title: `Skill Tank ${currentYear}-${nextYear} | Inter-School Robotics Championship`,
    description: `Join the ultimate inter-school robotics and innovation championship by PNT Academy. Showcase your STEM problem-solving skills to industry experts.`,
    url: "https://pntacademy.com/championship",
    type: "website",
    siteName: "PNT Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: `Skill Tank ${currentYear}-${nextYear} | Robotics Championship`,
    description: `The ultimate inter-school robotics championship. Register your school team today!`,
  },
  alternates: {
    canonical: "/championship",
  },
};

export default async function ChampionshipPage() {
    await connectMongo();
    const settings = await AdminSettings.findOne({});
    const formLink = settings?.roboticsChampionshipLink || settings?.individualChampionshipLink || "mailto:Contact@pntacademy.com";

    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden bg-white dark:bg-[#020617] selection:bg-blue-600 selection:text-white transition-colors duration-500">
            <Navbar />
            <ChampionshipContent isIndividual={false} registrationLink={formLink} />
            
            <Footer />
        </main>
    );
}
