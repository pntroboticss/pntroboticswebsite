"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

type GalleryItem = {
    id: string;
    title: string;
    image_url: string;
};

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
    const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

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

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-24 relative z-10">
            {/* Symmetrical Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ delay: (index % 10) * 0.05, duration: 0.5 }}
                        className="relative group cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-md hover:shadow-2xl hover:shadow-indigo-500/20 border border-slate-200 dark:border-slate-800 transition-all duration-500 aspect-square"
                        onClick={() => setSelectedImage(item)}
                    >
                        <Image 
                            src={item.image_url} 
                            alt={item.title || "Gallery Image"} 
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Glassmorphism Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 backdrop-blur-[2px]">
                            {item.title && (
                                <motion.p 
                                    className="text-white font-bold text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 line-clamp-2"
                                >
                                    {item.title}
                                </motion.p>
                            )}
                            <div className="flex items-center gap-2 mt-3 text-cyan-400 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 opacity-0 group-hover:opacity-100">
                                <ZoomIn className="w-5 h-5" />
                                <span className="text-sm font-semibold uppercase tracking-wider">View Image</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 md:p-12"
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
