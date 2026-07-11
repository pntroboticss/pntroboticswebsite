"use client";

import { useRef, useState, useEffect } from "react";
import { CheckCircle2, Award, Tv, ShieldCheck } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/lib/supabase";

gsap.registerPlugin(ScrollTrigger);

const SPECIALTIES = [
    "Artificial Intelligence (AI)",
    "Software Development",
    "Robotics",
    "Sensor Fusion",
    "Machine Learning",
    "Autonomous Navigation",
    "Internet of Things (IoT)",
    "Data Science & Analytics",
    "Human-Computer Interaction",
    "Robotic Arm & AGV's"
];

// Note: These are now empty placeholders. The actual images should be uploaded via the Admin Panel.
const CAROUSEL_IMAGES = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    src: "",
    alt: `Slot ${i + 1}`
}));

export default function CompanyOverview() {
    const sectionRef = useRef<HTMLElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [hasIntroPlayed, setHasIntroPlayed] = useState(false);
    const [liveImages, setLiveImages] = useState<{id: number, src: string, alt: string}[]>([]);

    useEffect(() => {
        const fetchImages = async () => {
            const { data, error } = await supabase
                .from("site_highlights")
                .select("media_url, slot_index")
                .eq("section", "machine_images")
                .order("slot_index", { ascending: true });
            
            if (!error && data && data.length > 0) {
                const uploadedImages = data
                    .filter(item => item.slot_index >= 1 && item.slot_index <= 20)
                    .sort((a, b) => a.slot_index - b.slot_index)
                    .map(item => ({
                        id: item.slot_index,
                        src: item.media_url,
                        alt: `Slot ${item.slot_index}`
                    }));
                setLiveImages(uploadedImages);
            } else {
                setLiveImages([]);
            }
        };
        fetchImages();
    }, []);

    const updateCarousel = (newIndex: number) => {
        const wrappedIndex = gsap.utils.wrap(0, liveImages.length, newIndex);
        setActiveIndex(wrappedIndex);
    };

    // Auto-play interval: starts only AFTER intro is done
    useEffect(() => {
        if (!hasIntroPlayed) return;

        const interval = setInterval(() => {
            setActiveIndex(prev => gsap.utils.wrap(0, liveImages.length, prev + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, [hasIntroPlayed, liveImages.length]);

    useGSAP(() => {
        if (!carouselRef.current) return;
        const cards = gsap.utils.toArray<HTMLElement>(".carousel-card", carouselRef.current);
        if (cards.length === 0) return;
        
        const spacingX = typeof window !== 'undefined' ? window.innerWidth * 0.25 : 400;

        if (!hasIntroPlayed) {
            // INTRO SEQUENCE
            // 1. Initial State: Scattered in deep 3D space, invisible
            gsap.set(cards, {
                x: () => (Math.random() - 0.5) * 1500,
                y: () => (Math.random() - 0.5) * 1000,
                z: -3000,
                scale: 0,
                opacity: 0,
                rotationX: () => (Math.random() - 0.5) * 720,
                rotationY: () => (Math.random() - 0.5) * 720,
                rotationZ: () => (Math.random() - 0.5) * 720,
                filter: "blur(20px)"
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 60%", // Triggers when section is in view
                    once: true
                },
                onComplete: () => {
                    // Trigger the transition to the normal carousel layout
                    setHasIntroPlayed(true);
                }
            });

            // 2. The "Bang": All images violently slam into the center position
            tl.to(cards, {
                x: 0,
                y: 0,
                z: 0,
                scale: 1.1,
                opacity: 1,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                filter: "blur(0px)",
                duration: 1,
                ease: "expo.out",
                stagger: 0.1 // Slight delay so they crash into each other
            })
                // 3. Anticipation: Squeeze before the explosion ("destroyed")
                .to(cards, {
                    scale: 0.9,
                    duration: 0.3,
                    ease: "power3.in"
                });

        } else {
            // NORMAL CAROUSEL LAYOUT
            // This runs after the intro completes, violently scattering them to their correct spots
            cards.forEach((card, i) => {
                let diff = i - activeIndex;
                if (diff > cards.length / 2) diff -= cards.length;
                if (diff < -cards.length / 2) diff += cards.length;

                const absDist = Math.abs(diff);
                const x = diff * spacingX;
                const scale = Math.max(0.2, 1 - absDist * 0.35);
                const blurAmount = absDist * 10;
                const opacity = Math.max(0, 1 - absDist * 0.4);
                const zIndex = 100 - absDist * 10;

                // For the very first scatter (when activeIndex hasn't manually changed yet), 
                // use a bouncy explosion ease. For subsequent normal ticks, use a smooth ease.
                gsap.to(card, {
                    x: x,
                    y: 0,
                    scale: scale,
                    rotation: 0,
                    opacity: opacity,
                    zIndex: zIndex,
                    filter: `blur(${blurAmount}px)`,
                    duration: 1.5,
                    ease: "elastic.out(1, 0.6)", // Gives that explosive "disracted" scatter feel
                    overwrite: "auto"
                });
            });
        }

    }, { dependencies: [activeIndex, hasIntroPlayed], scope: sectionRef });

    // Drag tracking state
    const dragStartX = useRef<number | null>(null);

    const handlePointerDown = (e: React.PointerEvent) => {
        dragStartX.current = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (dragStartX.current === null) return;

        const delta = e.clientX - dragStartX.current;
        if (delta > 50) {
            updateCarousel(activeIndex - 1);
            dragStartX.current = e.clientX;
        } else if (delta < -50) {
            updateCarousel(activeIndex + 1);
            dragStartX.current = e.clientX;
        }
    };

    const handlePointerUp = () => {
        dragStartX.current = null;
    };

    return (
        <section ref={sectionRef} id="about" className="relative w-full min-h-screen py-24 md:py-32 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden flex items-center">

            {/* Ambient Glowing Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3 z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3 z-0" />

            {/* FULL WIDTH CAROUSEL BACKGROUND LAYER (z-10) */}
            <div className="absolute inset-0 w-full h-full flex justify-center items-center perspective-[1200px] pointer-events-none z-10">
                <div
                    ref={carouselRef}
                    className="relative w-full max-w-[450px] h-[550px] touch-none pointer-events-auto cursor-grab active:cursor-grabbing translate-x-0 lg:translate-x-[15vw]"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    {liveImages.map((img, i) => (
                        <div
                            key={i}
                            onClick={() => updateCarousel(i)}
                            className="carousel-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/50 dark:border-slate-800/80 cursor-pointer bg-slate-900"
                            style={{ transformOrigin: "center bottom" }}
                        >
                            {img.src ? (
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 450px"
                                    className="object-cover pointer-events-none"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
                                    <span className="font-bold uppercase tracking-widest text-sm">Image {img.id}</span>
                                    <span className="text-xs mt-1">(Upload in Admin)</span>
                                </div>
                            )}
                            {/* Dark overlay for inactive items */}
                            <div className={`absolute inset-0 bg-black/40 transition-opacity duration-500 pointer-events-none ${activeIndex === i && hasIntroPlayed ? 'opacity-0' : 'opacity-100'}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* TEXT LAYER ON TOP LEFT (z-20) */}
            <div className="container mx-auto px-4 lg:px-8 relative z-20 pointer-events-none">
                <div className="w-full lg:w-1/2 pointer-events-auto">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-400 font-semibold text-sm mb-8 border border-cyan-200 dark:border-cyan-800/50 shadow-sm">
                        <ShieldCheck className="w-4 h-4" />
                        About Us
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-slate-900 dark:text-white leading-tight drop-shadow-lg">
                        Build with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                            PNT Robotics
                        </span>
                    </h2>

                    <div className="space-y-4 mb-10 max-w-xl text-slate-800 dark:text-slate-200">
                        <p className="text-base md:text-lg leading-relaxed font-medium">
                            We at <strong className="text-black dark:text-white font-bold">PNT Robotics and Automation Solutions</strong> are proud to be recognized as a leading startup in the robotics industry, prominently featured among Maharashtra's top 100 startups.
                        </p>
                        <p className="text-sm md:text-base leading-relaxed font-medium">
                            Our journey includes showcasing our innovative technology on <strong className="text-black dark:text-white font-bold">SHARK TANK INDIA</strong>, where we stood out among 65,000 entries and secured funding from <span className="whitespace-nowrap"><strong className="text-black dark:text-white font-bold">LensKart</strong></span>.
                        </p>
                        <p className="text-sm md:text-base leading-relaxed font-medium">
                            Additionally, we hold memberships in the Government e-Marketplace (GeM) and the Central Public Procurement Portal (CPPP), underlining our commitment to excellence and regulatory compliance.
                        </p>
                    </div>

                    <div className="mb-4">
                        <span className="text-sm font-bold tracking-wider text-slate-800 dark:text-slate-200 uppercase">We specialize in:</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 max-w-xl">
                        {SPECIALTIES.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 transition-colors backdrop-blur-sm border border-slate-300/80 dark:border-slate-700/80 shadow-sm">
                                <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                                <span className="text-slate-900 dark:text-slate-100 font-semibold text-sm leading-tight">{item}</span>
                            </div>
                        ))}
                    </div>

                    {/* Shark Tank Badge */}
                    <div className="inline-flex items-center gap-4 p-4 pr-6 rounded-2xl bg-gradient-to-r from-amber-50/90 to-orange-50/90 dark:from-amber-950/80 dark:to-orange-950/80 backdrop-blur-sm border border-amber-200/50 dark:border-amber-700/30 shadow-lg">
                        <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-xl shadow-md flex items-center justify-center border border-amber-100 dark:border-slate-700">
                            <Tv className="w-7 h-7 text-amber-500" />
                        </div>
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-1 flex items-center gap-1">
                                <Award className="w-3 h-3" /> Featured Nationally
                            </div>
                            <div className="font-bold text-slate-900 dark:text-white">
                                Shark Tank India
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
