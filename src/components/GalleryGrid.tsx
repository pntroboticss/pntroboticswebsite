"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
            {/* Masonry/Grid Layout */}
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ delay: (index % 10) * 0.1, duration: 0.5 }}
                        className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-sm hover:shadow-xl transition-all duration-500"
                        onClick={() => setSelectedImage(item)}
                    >
                        <div className="relative w-full" style={{ paddingBottom: `${Math.floor(Math.random() * (150 - 75 + 1) + 75)}%` }}>
                            {/* We use a padding-bottom hack to create variable height grids (masonry feel) or just let image dictate height if we knew dimensions. Since we don't know dimensions, we'll let Next.js Image render with layout="fill" in a varied aspect container. Wait, it's better to just use a standard image tag or Next Image without fill so it sizes naturally in CSS columns! */}
                            <Image 
                                src={item.image_url} 
                                alt={item.title || "Gallery Image"} 
                                width={800}
                                height={800}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            {item.title && (
                                <p className="text-white font-semibold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    {item.title}
                                </p>
                            )}
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
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button 
                            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
                            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative max-w-5xl w-full max-h-[85vh] aspect-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img 
                                src={selectedImage.image_url} 
                                alt={selectedImage.title || "Gallery View"}
                                className="w-full h-full object-contain rounded-lg"
                                style={{ maxHeight: '85vh' }}
                            />
                            {selectedImage.title && (
                                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-b-lg">
                                    <p className="text-white text-xl font-medium">{selectedImage.title}</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
