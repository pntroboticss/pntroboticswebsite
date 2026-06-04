"use client";

import { motion, Variants } from "framer-motion";


const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export default function HeroSection() {
  return (
    <section id="hero" className="relative flex flex-col items-center justify-center pt-32 pb-24 min-h-[85vh]">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 sm:px-6 z-10 flex flex-col items-center text-center justify-center gap-8"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm transition-colors duration-500 max-w-5xl"
        >
          Engineering the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">future</span> of robotics and automation systems.
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mt-4 transition-colors duration-500 font-medium"
        >
          We are currently building our new platform to provide you with an exceptional experience. Explore a preview of our capabilities below.
        </motion.p>
      </motion.div>
    </section>
  );
}
