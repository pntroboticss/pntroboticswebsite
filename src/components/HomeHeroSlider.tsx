"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/images/slider/modi.jpg",
    customPosition: "center", 
    alignment: "right", 
    contentImage: "/images/slider/modi.png",
    title: "Appreciation from Hon. Prime Minister",
    subtitle: "Mentioned in 'Mann Ki Baat' for our contributions to the robotics ecosystem.",
    href: "/about"
  },
  {
    id: 2,
    video: "/videos/sharktank.mp4", // This will play as the background!
    imagePosition: "object-center",
    title: "Featured on Shark Tank India",
    subtitle: "Nationally recognized for our innovative robotics platforms.",
    href: "/about"
  },
  {
    id: 3,
    image: "/images/slider/agv.jpeg",
    imagePosition: "object-center",
    title: "Delivering Customized Robotics Platforms",
    subtitle: "Specializing in AGVs, AMRs, Robotic Arms, and advanced Humanoid Robots.",
    href: "/products"
  },
  {
    id: 4,
    image: "/images/slider/power.jpeg",
    imagePosition: "object-center",
    title: "Products for the Power Industry",
    subtitle: "Solving critical infrastructure challenges with automated robotics solutions.",
    href: "/products/power"
  },
  {
    id: 5,
    image: "/images/slider/robotic_arm.jpeg", 
    imagePosition: "object-center",
    title: "Delivering Products for Defense",
    subtitle: "Precision engineering and situational awareness for national security.",
    href: "/products/defence"
  }
];

export default function HomeHeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 10000); // Increased to 10 seconds so it stays longer
    return () => clearInterval(timer);
  }, [isHovered]);

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div 
      className="relative w-full h-screen min-h-[600px] bg-slate-950 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Background Media (Image or Video) */}
          <div className="absolute inset-0">
            {slides[current].video ? (
              <video 
                src={slides[current].video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover bg-slate-900"
                style={{ objectPosition: slides[current].customPosition || "center" }}
              />
            ) : (
              <Image 
                src={slides[current].image!}
                alt={slides[current].title}
                fill
                priority
                unoptimized={true}
                quality={100}
                className="object-cover bg-slate-900"
                style={{ objectPosition: slides[current].customPosition || "center" }}
              />
            )}
          </div>

          {/* Minimal overlay just to ensure the glass box pops */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Content - Glass Card */}
          <div className={`absolute inset-0 flex items-center px-6 md:px-24 max-w-7xl mx-auto w-full pt-16 ${
              slides[current].alignment === "right" ? "justify-end" : "justify-start"
            }`}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className={`relative ${slides[current].contentImage ? "w-fit inline-block p-6 md:p-8" : "w-full max-w-xl md:max-w-2xl p-8 md:p-12"} bg-black/40 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl`}
            >
              {slides[current].contentImage ? (
                // If there is a contentImage, tightly wrap it
                <div className="flex flex-col gap-4 items-center w-full max-w-xs">
                  <div className="relative w-full h-[35vh] md:h-[40vh] max-h-[350px] rounded-xl overflow-hidden shadow-lg">
                    <Image 
                      src={slides[current].contentImage!} 
                      alt="Screenshot" 
                      fill 
                      className="object-contain"
                    />
                  </div>
                  <h1 className="text-xl md:text-2xl font-light text-white tracking-wide leading-snug drop-shadow-md text-center">
                    {slides[current].title}
                  </h1>
                </div>
              ) : (
                // Otherwise show the standard large text layout
                <>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-wide leading-snug mb-4 drop-shadow-md">
                    {slides[current].title}
                  </h1>
                  <p className="text-base md:text-lg text-white/80 font-light leading-relaxed pr-10">
                    {slides[current].subtitle}
                  </p>
                </>
              )}
              
              {/* Sleek Arrow CTA */}
              <Link href={slides[current].href}>
                <button className="absolute bottom-8 right-8 group transition-all duration-300">
                  <ArrowRight className="w-6 h-6 text-red-500/80 group-hover:text-red-500 group-hover:translate-x-1 transition-all duration-300" />
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls Grouped at Bottom Center */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        
        {/* Left Arrow */}
        <button 
          onClick={prevSlide}
          className="p-2 rounded-full border border-white/60 text-white/80 hover:text-white hover:border-white transition-all backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow */}
        <button 
          onClick={nextSlide}
          className="p-2 rounded-full border border-white/60 text-white/80 hover:text-white hover:border-white transition-all backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
