"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { X } from "lucide-react";

type GalleryItem = {
    id: string;
    title: string;
    image_url: string;
};

// Helper to generate a deterministic pseudo-random number based on a string ID
const getDeterministicHeight = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Return a percentage between 75% and 150%
    return 75 + (Math.abs(hash) % 75);
};

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Create 3 parallax scroll speeds for columns to make it extremely dynamic
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, -100]);

    // Spring physics for smooth parallax
    const smoothY1 = useSpring(y1, { stiffness: 100, damping: 30 });
    const smoothY2 = useSpring(y2, { stiffness: 100, damping: 30 });
    const smoothY3 = useSpring(y3, { stiffness: 100, damping: 30 });

    if (!items || items.length === 0) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Gallery Coming Soon</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                    We are currently curating our photo gallery. Check back shortly to see our robots in action.
                </p>
            </div>
        );
    }

    // Split items into 3 columns for the parallax layout
    const col1 = items.filter((_, i) => i % 3 === 0);
    const col2 = items.filter((_, i) => i % 3 === 1);
    const col3 = items.filter((_, i) => i % 3 === 2);

    const renderColumn = (colItems: GalleryItem[], colIndex: number, yTransform: any) => (
        <motion.div style={{ y: yTransform }} className="flex flex-col gap-6 w-full">
            {colItems.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ delay: index * 0.1, duration: 0.6, type: "spring", bounce: 0.4 }}
                    className="relative group cursor-pointer overflow-hidden rounded-3xl bg-slate-200 dark:bg-slate-800 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500"
                    onClick={() => setSelectedImage(item)}
                >
                    <div 
                        className="relative w-full" 
                        style={{ paddingBottom: `${getDeterministicHeight(item.id)}%` }}
                    >
                        <Image 
                            src={item.image_url} 
                            alt={item.title || "Gallery Image"} 
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                        />
                    </div>
                    
                    {/* Glassmorphism Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 backdrop-blur-[2px]">
                        {item.title && (
                            <motion.p 
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                className="text-white font-bold text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                            >
                                {item.title}
                            </motion.p>
                        )}
                        <div className="w-8 h-1 bg-cyan-400 mt-3 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-24 relative z-10" ref={containerRef}>
            {/* 3-Column Parallax Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {renderColumn(col1, 0, smoothY1)}
                <div className="md:mt-24">
                    {renderColumn(col2, 1, smoothY2)}
                </div>
                {renderColumn(col3, 2, smoothY3)}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 md:p-12"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button 
                            className="absolute top-6 right-6 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all hover:scale-110 z-50"
                            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full h-[85vh] rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20">
                                <Image 
                                    src={selectedImage.image_url} 
                                    alt={selectedImage.title || "Gallery View"}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                />
                            </div>
                            {selectedImage.title && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="absolute bottom-10 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-2xl"
                                >
                                    <p className="text-white text-xl font-bold tracking-wide">{selectedImage.title}</p>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
