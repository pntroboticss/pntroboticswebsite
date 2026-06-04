import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormAnimated from "@/components/ContactFormAnimated";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | PNT Robotics",
  description: "Get in touch with PNT Robotics for any inquiries about our industrial automation solutions, robotic arms, and AGVs.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-transparent transition-colors duration-500">
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div className="pt-20" />

      <ContactFormAnimated />

      <Footer />
    </main>
  );
}
