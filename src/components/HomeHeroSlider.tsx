"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

gsap.registerPlugin(ScrollTrigger);

// Note: These are now empty placeholders. The actual videos should be uploaded via the Admin Panel.
const HERO_VIDEOS = [
  "",
  "",
  "",
  "",
  "",
  ""
];

export default function HomeHeroSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [liveVideos, setLiveVideos] = useState<string[]>(HERO_VIDEOS);

  const mediaWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch custom videos from Supabase
    const fetchVideos = async () => {
      const { data, error } = await supabase
        .from("site_highlights")
        .select("media_url, slot_index")
        .eq("section", "hero_videos")
        .order("slot_index", { ascending: true });
        
      if (!error && data && data.length > 0) {
        // Construct the array. If a slot is missing in DB, fallback to the default HERO_VIDEOS for that slot.
        const mergedVideos = [...HERO_VIDEOS];
        data.forEach(item => {
          if (item.slot_index >= 1 && item.slot_index <= 6) {
            mergedVideos[item.slot_index - 1] = item.media_url;
          }
        });
        setLiveVideos(mergedVideos);
      }
    };
    fetchVideos();
  }, []);

  // Auto-play the next video when the source changes
  useEffect(() => {
    if (liveVideos[currentVideoIndex]) {
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
      }
    } else {
      // If the slot is empty, wait 3 seconds and skip to the next
      const timer = setTimeout(() => {
        handleVideoEnd();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentVideoIndex, liveVideos]);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % liveVideos.length);
  };

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Reveal Video, Text & CTA Immediately (No Boot Screen)
    tl.fromTo(mediaWrapperRef.current, { scale: 1.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" })
      .fromTo(textRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=1")
      .fromTo(ctaRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.3)" }, "-=0.5");

    // 2. On Scroll Parallax
    gsap.to(mediaWrapperRef.current, {
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
        <div ref={mediaWrapperRef} className="absolute inset-0 w-full h-full opacity-0">
          {liveVideos[currentVideoIndex] ? (
            <video
              ref={videoRef}
              src={liveVideos[currentVideoIndex]}
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnd}
              className="w-full h-full object-cover transition-opacity duration-1000"
            />
          ) : (
            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
              <span className="text-slate-700 uppercase tracking-widest font-bold">Waiting for Video {currentVideoIndex + 1}</span>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-black/50 z-10" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-6 z-10 mt-12 md:mt-0">
          <div ref={textRef} className="max-w-4xl opacity-0">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 leading-tight">
              Precision Engineered.<br />Built for the Future.
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 font-light mb-8 md:mb-10 max-w-2xl mx-auto px-4 md:px-0">
              Nationally recognized robotics and automation solutions for defense, manufacturing, and R&D.
            </p>
          </div>

          <Link href="/products" ref={ctaRef} className="opacity-0 group relative px-6 md:px-8 py-3 md:py-4 bg-cyan-600 rounded-full font-bold text-base md:text-lg tracking-wider overflow-hidden hover:scale-105 transition-transform duration-300">
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
