"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function AppleScrollSequence() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);
    const mainImgRef = useRef<HTMLDivElement>(null);
    
    // Texts
    const title1Ref = useRef<HTMLDivElement>(null);
    const title2Ref = useRef<HTMLDivElement>(null);
    const title3Ref = useRef<HTMLDivElement>(null);
    
    // Secondary images
    const secImg1Ref = useRef<HTMLDivElement>(null);
    const secImg2Ref = useRef<HTMLDivElement>(null);
    
    // Particles
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Particle effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: any[] = [];
        for(let i=0; i<50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                alpha: Math.random() * 0.5
            });
        }

        let animationFrameId: number;
        
        function render() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                if(p.x < 0) p.x = canvas.width;
                if(p.x > canvas.width) p.x = 0;
                if(p.y < 0) p.y = canvas.height;
                if(p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`; // Cyan color
                ctx.fill();
            });
            
            animationFrameId = requestAnimationFrame(render);
        }
        
        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    useGSAP(() => {
        if (!containerRef.current || !pinRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=300%",
                scrub: 1, // Smooth scrub
                pin: pinRef.current,
                anticipatePin: 1
            }
        });

        // Initial states
        gsap.set([title1Ref.current, title2Ref.current, title3Ref.current], { opacity: 0, y: 50 });
        gsap.set(secImg1Ref.current, { xPercent: -150, opacity: 0 });
        gsap.set(secImg2Ref.current, { xPercent: 150, opacity: 0 });
        gsap.set(mainImgRef.current, { scale: 0.8, opacity: 1 });

        // Phase 1: Main image scales up, title 1 appears
        tl.to(mainImgRef.current, { scale: 1.1, duration: 1 })
          .to(title1Ref.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.8")
          .to(title1Ref.current, { opacity: 0, y: -50, duration: 0.5 })
        
        // Phase 2: Main image fades to background, title 2 and secondary images enter
          .to(mainImgRef.current, { opacity: 0.2, duration: 0.5 }, "-=0.2")
          .to(title2Ref.current, { opacity: 1, y: 0, duration: 0.5 }, "<")
          .to(secImg1Ref.current, { xPercent: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "<")
          .to(secImg2Ref.current, { xPercent: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "<")
          
        // Phase 3: Title 2 exits, final title scales in
          .to([title2Ref.current, secImg1Ref.current, secImg2Ref.current], { opacity: 0, y: -50, duration: 0.5 })
          .fromTo(title3Ref.current, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)" });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative h-[400vh] bg-slate-950 w-full text-white">
            <div ref={pinRef} className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
                
                {/* Particle Canvas */}
                <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-50" />

                {/* Main Image */}
                <div ref={mainImgRef} className="absolute inset-0 flex items-center justify-center z-0">
                    <div className="relative w-full max-w-[90%] md:max-w-5xl h-[50vh] md:h-[70vh]">
                        <Image 
                            src="/images/humanoid-robot-lab.png" 
                            alt="Robotics Lab" 
                            fill 
                            className="object-cover rounded-[40px] shadow-2xl shadow-cyan-900/20"
                            priority
                        />
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950 z-10 pointer-events-none" />

                {/* Title 1 */}
                <div ref={title1Ref} className="absolute z-20 text-center px-4 w-full">
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 text-white drop-shadow-2xl">
                        The Future of Robotics.
                    </h2>
                    <p className="text-lg md:text-2xl text-slate-300 font-light max-w-2xl mx-auto">
                        Engineered with precision. Built for extreme capabilities.
                    </p>
                </div>

                {/* Title 2 */}
                <div ref={title2Ref} className="absolute z-20 text-center px-4 w-full">
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 text-white drop-shadow-2xl">
                        Custom Built.
                    </h2>
                    <p className="text-lg md:text-2xl text-slate-300 font-light max-w-2xl mx-auto">
                        Every component tailored to industry demands.
                    </p>
                </div>

                {/* Secondary Images */}
                <div ref={secImg1Ref} className="absolute left-4 md:left-16 top-[60%] md:top-1/2 -translate-y-1/2 w-[40vw] md:w-[25vw] h-[25vh] md:h-[40vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-20">
                    <Image src="/images/slider/robobuild2.jpg" alt="Building Robot" fill className="object-cover" />
                </div>

                <div ref={secImg2Ref} className="absolute right-4 md:right-16 top-[40%] md:top-1/2 -translate-y-1/2 w-[40vw] md:w-[25vw] h-[25vh] md:h-[40vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-20">
                    <Image src="/images/slider/agv.jpeg" alt="AGV Robot" fill className="object-cover" />
                </div>

                {/* Title 3 */}
                <div ref={title3Ref} className="absolute z-30 text-center px-4 w-full">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-500 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                        Unleash Potential.
                    </h2>
                </div>

            </div>
        </section>
    );
}
