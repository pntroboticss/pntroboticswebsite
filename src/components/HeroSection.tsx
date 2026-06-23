"use client";

import { useScroll, useTransform, motion } from "framer-motion";

export default function HeroSection() {
    const { scrollYProgress } = useScroll();

    // Since the page is much longer now (Hero + Ribbon + Features + About), 
    // the Hero section only occupies the first 30% of the total scroll!
    // We adjust the framer-motion mapping bounds from [0, 1] down to [0, 0.3].
    
    // We use vertical (y) translation and scale instead of horizontal sliding so it feels perfectly synced with scrolling
    const text1Y = useTransform(scrollYProgress, [0, 0.1], ["0%", "50%"]);
    const text1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.1], [1, 1, 0]);
    const text1Scale = useTransform(scrollYProgress, [0, 0.1], [1, 1.2]);

    const text2Y = useTransform(scrollYProgress, [0.05, 0.15, 0.2, 0.25], ["50%", "0%", "0%", "-50%"]);
    const text2Opacity = useTransform(scrollYProgress, [0.05, 0.15, 0.2, 0.25], [0, 1, 1, 0]);
    const text2Scale = useTransform(scrollYProgress, [0.05, 0.15, 0.2, 0.25], [0.8, 1, 1, 1.2]);

    const text3Y = useTransform(scrollYProgress, [0.2, 0.25], ["50%", "0%"]);
    const text3Opacity = useTransform(scrollYProgress, [0.2, 0.25], [0, 1]);
    const text3Scale = useTransform(scrollYProgress, [0.2, 0.25], [0.8, 1]);

    return (
        // We use relative z-10 for the text container, but it has no background!
        // This ensures the fixed 3D Canvas sits perfectly in the background.
        // Wait, if the user wants the Hero Text BEHIND the AGV, we can set z-[-10].
        // Let's set it to z-[-10] so the robot physically masks the PNT ROBOTICS text!
        <div className="w-full relative h-[300vh] z-[-10]">
            
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pointer-events-none">
                
                {/* Slide 1: Original Slogan */}
                <motion.div style={{ y: text1Y, opacity: text1Opacity, scale: text1Scale }} className="absolute flex flex-col items-center justify-center text-center w-full px-4">
                    <div className="flex flex-row items-center justify-between w-full max-w-[1400px] px-4 md:px-12">
                        <h1 className="text-[4rem] md:text-[10rem] font-black text-slate-900 dark:text-white drop-shadow-2xl transition-colors duration-500 tracking-tighter uppercase leading-none">
                            PNT
                        </h1>
                        <h1 className="text-[4rem] md:text-[10rem] font-black text-slate-900 dark:text-white drop-shadow-2xl transition-colors duration-500 tracking-tighter uppercase leading-none">
                            ROBOTICS
                        </h1>
                    </div>
                    <p className="text-2xl md:text-5xl text-blue-600 dark:text-blue-400 font-bold mt-8 drop-shadow-lg">
                        Engineering the future.
                    </p>
                </motion.div>

                {/* Slide 2: Precision Engineered */}
                <motion.div style={{ y: text2Y, opacity: text2Opacity, scale: text2Scale }} className="absolute flex flex-col items-center justify-center text-center w-full px-4">
                    <h1 className="text-[4rem] md:text-[8rem] font-black text-slate-900 dark:text-white drop-shadow-2xl transition-colors duration-500 tracking-tighter uppercase leading-none">
                        Precision
                    </h1>
                    <h1 className="text-[4rem] md:text-[8rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 drop-shadow-2xl transition-all duration-500 tracking-tighter uppercase leading-none">
                        Engineered.
                    </h1>
                </motion.div>

                {/* Slide 3: Specs and Call to Action */}
                <motion.div style={{ y: text3Y, opacity: text3Opacity, scale: text3Scale }} className="absolute flex flex-col items-center justify-center text-center w-full px-4">
                    <h1 className="text-6xl md:text-[7rem] font-black text-slate-900 dark:text-white drop-shadow-2xl transition-colors duration-500 tracking-tighter uppercase leading-tight">
                        100% Autonomous
                    </h1>
                    <p className="text-xl md:text-3xl text-slate-600 dark:text-slate-300 font-medium mt-6 max-w-3xl leading-relaxed">
                        Seamlessly integrates into your existing warehouse infrastructure.
                    </p>
                    <button className="mt-12 px-12 py-5 bg-slate-900 dark:bg-white text-white dark:text-black text-xl md:text-2xl font-bold rounded-full pointer-events-auto hover:scale-105 transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_rgba(255,255,255,0.2)]">
                        Explore Our Solutions
                    </button>
                </motion.div>

            </div>
        </div>
    );
}
