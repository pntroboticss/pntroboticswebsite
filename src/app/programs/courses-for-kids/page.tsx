import { Metadata } from 'next';
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
    title: "Robotics & Coding for Kids",
    description: "PNT Academy training program for kids. Teach your kids hands-on robotics, drone building, Python coding, and logic design from a young age.",
};

import Footer from "@/components/Footer";
import CoursesForKidsHero from "@/components/CoursesForKidsHero";
import CoursesForKidsContent from "@/components/CoursesForKidsContent";

export default function CoursesForKidsPage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500">
            <Navbar />

            <CoursesForKidsHero />

            <div id="programs">
                <CoursesForKidsContent />
            </div>

            <Footer />
        </main>
    );
}
