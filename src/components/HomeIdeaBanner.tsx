"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lightbulb } from "lucide-react";
import CustomProjectModal from "./CustomProjectModal";

gsap.registerPlugin(ScrollTrigger);

export default function HomeIdeaBanner() {
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const borderSvgRef = useRef<SVGSVGElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const lightbulbRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                end: "bottom 80%",
                toggleActions: "play none none reverse",
            }
        });

        // 1. Grid fades in
        tl.to(".banner-grid", { opacity: 0.1, duration: 1 })
        
        // 2. SVG borders draw
        .fromTo(".banner-border-line", 
            { strokeDasharray: 1000, strokeDashoffset: 1000 },
            { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, "-=0.5"
        )
        
        // 3. Background color fades in
        .to(".banner-bg", { opacity: 1, duration: 0.5 }, "-=0.5")
        
        // 4. Content materializes
        .fromTo(contentRef.current, 
            { opacity: 0, y: 30, filter: "blur(10px)" }, 
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" }, "-=1"
        )
        
        // 5. Lightbulb ignites (glows)
        .fromTo(lightbulbRef.current,
            { scale: 0.5, opacity: 0, filter: "brightness(1) drop-shadow(0 0 0px rgba(6,182,212,0))" },
            { scale: 1, opacity: 1, filter: "brightness(1.5) drop-shadow(0 0 20px rgba(6,182,212,0.8))", duration: 1, ease: "elastic.out(1, 0.3)" }, "-=0.5"
        );

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 bg-slate-950 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                
                <div className="max-w-4xl mx-auto relative group">
                    
                    {/* SVG Drawing Border */}
                    <svg ref={borderSvgRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" style={{ overflow: 'visible' }}>
                        <rect 
                            className="banner-border-line"
                            x="0" y="0" width="100%" height="100%" 
                            rx="32" ry="32" 
                            fill="none" 
                            stroke="#06b6d4" 
                            strokeWidth="2" 
                        />
                    </svg>

                    <div className="relative w-full overflow-hidden rounded-[2rem] bg-transparent">
                        {/* Background & Grid */}
                        <div className="absolute inset-0 banner-bg opacity-0 bg-slate-900 border border-slate-800 rounded-[2rem]" />
                        <div className="absolute inset-0 banner-grid opacity-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

                        <div ref={contentRef} className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-6 sm:px-10 py-8 sm:py-10">
                            
                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 flex-1">
                                {/* Lightbulb Container */}
                                <div ref={lightbulbRef} className="py-5 px-5 bg-cyan-900/40 border border-cyan-500/30 rounded-3xl shrink-0">
                                    <Lightbulb className="w-10 h-10 text-cyan-400" strokeWidth={1.5} />
                                </div>
                                
                                <div className="mt-1">
                                    <h3 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
                                        Need a Customized Robotic Solution?
                                    </h3>
                                    <p className="text-slate-400 text-lg">
                                        Submit a blueprint request for your custom industrial machine.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0 shrink-0">
                                <button 
                                    onClick={() => setIsCustomModalOpen(true)}
                                    className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-cyan-600 text-white font-bold tracking-wide hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-[1.05] active:scale-[0.98]"
                                >
                                    INITIALIZE PROJECT
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <CustomProjectModal
                isOpen={isCustomModalOpen}
                onClose={() => setIsCustomModalOpen(false)}
            />
        </section>
    );
}
