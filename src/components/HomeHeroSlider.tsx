"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function HomeHeroSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Reveal Video, Text & CTA Immediately (No Boot Screen)
    tl.fromTo(videoRef.current, { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" })
      .fromTo(textRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=1")
      .fromTo(ctaRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.3)" }, "-=0.5");

    // 2. On Scroll Parallax
    gsap.to(videoRef.current, {
      yPercent: 30,
      scale: 1.05,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-slate-950 overflow-hidden text-white">

      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src="/videos/sharktank.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-0"
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <div ref={textRef} className="max-w-4xl opacity-0">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
              Precision Engineered.<br />Built for the Future.
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-light mb-10 max-w-2xl mx-auto">
              Nationally recognized robotics and automation solutions for defense, manufacturing, and R&D.
            </p>
          </div>

          <Link href="/products" ref={ctaRef} className="opacity-0 group relative px-8 py-4 bg-cyan-600 rounded-full font-bold text-lg tracking-wider overflow-hidden hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              INITIATE SYSTEM <span className="text-cyan-200">→</span>
            </span>
          </Link>
        </div>
      </div>

    </div>
  );
}
