"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type CertificationItem = {
    id: string;
    title: string;
    image_url: string;
};

const DUMMY_CERTIFICATES: CertificationItem[] = [
    { id: "dummy-1", title: "ISO 9001:2015", image_url: "/images/clients/DRDO.png" }, // Reusing some images as dummy
    { id: "dummy-2", title: "CE Marking", image_url: "/images/clients/BARC.png" },
    { id: "dummy-3", title: "RoHS Compliant", image_url: "/images/clients/Indian Army.png" },
    { id: "dummy-4", title: "Make In India", image_url: "/images/clients/Maharashtra-govt-1.png" },
    { id: "dummy-5", title: "Startup India", image_url: "/images/clients/Navy.png" },
];

export default function CertificationsLoop() {
    const [certs, setCerts] = useState<CertificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<CertificationItem | null>(null);

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const { data, error } = await supabase
                    .from("certifications")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (!error && data && data.length > 0) {
                    setCerts(data);
                } else {
                    // Fallback to dummy data
                    setCerts(DUMMY_CERTIFICATES);
                }
            } catch (err) {
                console.error("Error fetching certifications:", err);
                setCerts(DUMMY_CERTIFICATES);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCerts();
    }, []);

    if (isLoading) return null;

    // We duplicate the array to create a seamless infinite loop
    const loopItems = [...certs, ...certs, ...certs, ...certs];

    return (
        <section className="w-full py-16 bg-slate-50 dark:bg-black overflow-hidden transition-colors duration-500 border-t border-slate-200 dark:border-slate-900/50">
            <div className="max-w-7xl mx-auto px-6 text-center mb-10">
                <h2 className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                    Certifications & Awards
                </h2>
                <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="relative flex w-full overflow-hidden py-4">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 dark:from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 dark:from-black to-transparent z-10 pointer-events-none" />

                {/* Scrolling Track */}
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 30, repeat: Infinity }}
                    className="flex w-max items-center gap-12 px-6"
                >
                    {loopItems.map((cert, i) => (
                        <div key={`${cert.id}-${i}`} className="flex flex-col items-center group shrink-0" onClick={() => setSelectedImage(cert)}>
                            <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-center transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900/50 cursor-pointer p-3 md:p-4">
                                <img
                                    src={cert.image_url}
                                    alt={cert.title || "Certification"}
                                    className="h-56 md:h-80 w-auto object-contain rounded-xl"
                                />
                            </div>
                            {cert.title && (
                                <span className="mt-5 text-sm md:text-base font-semibold text-slate-600 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    {cert.title}
                                </span>
                            )}
                        </div>
                    ))}
                </motion.div>
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
                                <img
                                    src={selectedImage.image_url} 
                                    alt={selectedImage.title || "Certification"}
                                    className="w-full h-full object-contain"
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
        </section>
    );
}
