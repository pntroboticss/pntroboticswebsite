import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getLiveGallery } from "@/lib/actions/db";
import type { Metadata } from "next";
import { BrainCircuit, Cpu, Settings, Box, Info, Briefcase, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

const NetworkBackground = dynamic(() => import("@/components/NetworkBackground"));
const ProductSpotlight = dynamic(() => import("@/components/ProductSpotlight"));

export const metadata: Metadata = {
  title: "PNT Robotics | Premier Manufacturing & R&D Solutions",
  description: "PNT Robotics is a premier manufacturing and R&D company specializing in cutting-edge robotics, AI, and automation solutions for defense and industry.",
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  let productImages: string[] = [];

  try {
    const galleryItems = await getLiveGallery();
    // Filter items meant for the hardware spotlight (e.g. category 'Hardware' or 'Products')
    productImages = galleryItems
      .filter((item: any) => item.category === "Hardware" || item.category === "Products" || item.category === "Hardware Spotlight")
      .map((item: any) => item.image_url || item.imageUrl)
      .filter(Boolean);
  } catch (e) {
    console.error("Error reading products from DB", e);
  }

  return (
    <main className="relative min-h-screen bg-transparent text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500">
      <div className="relative flex flex-col min-h-screen">
        <Navbar />

        {/* Hero Section */}
        <section id="hero" className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
          <NetworkBackground />
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="container mx-auto px-4 sm:px-6 z-10 flex flex-col items-center text-center justify-center h-full gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-xs sm:text-sm text-blue-700 bg-blue-100/50 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md shadow-sm animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              Premier Defense & Industrial Robotics
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm transition-colors duration-500 max-w-5xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Engineering the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">Autonomous Systems.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mt-4 transition-colors duration-500 font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Delivering mission-critical robotics, AI, and custom hardware solutions. Trusted by India's defense sector, funded on Shark Tank India, and recognized for engineering excellence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link href="/products" className="px-8 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 hover:-translate-y-1 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 group">
                Explore Technology
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" className="px-8 py-4 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center">
                Corporate Overview
              </Link>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="py-16 relative z-20 bg-blue-600 dark:bg-slate-900 text-white border-y border-blue-500 dark:border-slate-800 shadow-xl">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-x-0 md:divide-x divide-white/20">
              {[
                { number: "100+", label: "Deployments" },
                { number: "15+", label: "Defense Integrations" },
                { number: "12", label: "Custom Platforms" },
                { number: "24/7", label: "Operational Reliability" }
              ].map((stat, i) => (
                <div key={i} className="px-4 py-2 hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl md:text-5xl font-black mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-200">{stat.number}</div>
                  <div className="text-blue-100 dark:text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Expertise Section */}
        <section className="py-24 relative z-10 bg-white/50 dark:bg-slate-900/20 backdrop-blur-md">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Engineering Excellence</h2>
              <div className="w-16 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mt-4" />
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { title: "AI-Driven Architecture", icon: BrainCircuit, desc: "Bespoke artificial intelligence models integrated with robust mechanical systems to solve complex operational constraints in unpredictable environments." },
                { title: "Precision Manufacturing", icon: Settings, desc: "End-to-end rapid prototyping and industrial-grade manufacturing ensuring every unit meets strict defense and commercial reliability standards." },
                { title: "Enterprise Integration", icon: Cpu, desc: "Seamless deployment of robotic fleets with custom middleware, allowing total control and analytics within your existing enterprise ecosystem." }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-400/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-blue-100 dark:border-blue-800/50">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hardware Showcase */}
        <section className="py-24 relative z-10 bg-slate-900 dark:bg-slate-950 text-white overflow-hidden border-t border-slate-800">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-7xl mx-auto">
              <div className="flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider text-cyan-400 bg-cyan-900/30 border border-cyan-800/50">
                  Hardware Spotlight
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                  Industrial-Grade <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    Autonomous Platforms
                  </span>
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed">
                  Our flagship Autonomous Mobile Robots (AMR) and Custom Hardware are built from the ground up for maximum reliability. Whether navigating complex factory floors or executing high-precision operations, our technology delivers unmatched performance.
                </p>
                <ul className="space-y-4 pt-2">
                  {[
                    "Heavy-duty payload capacities",
                    "Advanced LiDAR & Vision-based SLAM",
                    "Seamless fleet management integration",
                    "Military-grade robust construction"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-200 font-medium">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-6">
                  <Link href="/products" className="inline-flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition-colors group text-lg">
                    View Hardware Specs
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 w-full relative">
                {/* Decorative border / frame */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-3xl translate-x-3 translate-y-3 opacity-20 blur-sm" />
                <ProductSpotlight images={productImages} />
              </div>
            </div>
          </div>
        </section>

        {/* Partner Logos Marquee */}
        <section className="py-24 relative z-10 overflow-hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 text-center mb-12">
            <h2 className="text-sm font-black tracking-widest uppercase text-slate-400">Trusted by Industry Leaders</h2>
          </div>
          
          <div className="relative w-full flex overflow-x-hidden group">
            <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-white via-transparent to-white dark:from-slate-950 dark:via-transparent dark:to-slate-950 w-full" />
            
            <div className="animate-marquee flex items-center whitespace-nowrap min-w-max hover:[animation-play-state:paused]">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-16 md:gap-24 px-8 md:px-12">
                  {[
                    "BARC.png", "DRDO.png", "Indian Army.png", "Navy.png", 
                    "Sharktank.png", "TATA.png", "TMC.png", "Unilever.png", "Wockhardt.png"
                  ].map((logoName) => (
                    <div key={logoName} className="relative w-48 h-24 sm:w-60 sm:h-32 opacity-100 transition-all duration-300 hover:scale-110 grayscale hover:grayscale-0">
                      <Image
                         src={`/clients/${logoName.replace(' ', '%20')}`}
                        alt={logoName.split('.')[0]}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 65s linear infinite;
            }
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
              animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              opacity: 0;
            }
          `}} />
        </section>

        {/* Fast Access Section */}
        <section className="py-20 relative z-10 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Quick Access</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
              {[
                { title: "Our Products", icon: Box, link: "/products", color: "bg-blue-500 shadow-blue-500/20" },
                { title: "About Us", icon: Info, link: "/about", color: "bg-purple-500 shadow-purple-500/20" },
                { title: "Careers", icon: Briefcase, link: "/careers", color: "bg-cyan-500 shadow-cyan-500/20" },
                { title: "Contact Us", icon: Mail, link: "/contact", color: "bg-orange-500 shadow-orange-500/20" },
              ].map((item, i) => (
                <Link key={i} href={item.link} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl ${item.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Photo Gallery - Temporarily removed */}
        {/* <Gallery /> */}

        <Footer />
      </div>
    </main>
  );
}

