"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getLiveGallery } from "@/lib/actions/db";

export default function Gallery() {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        getLiveGallery().then(setItems).catch(console.error);
    }, []);

    if (!items || items.length === 0) {
        return (
            <section id="gallery" className="py-24 relative border-t border-slate-900/10 dark:border-white/5 bg-slate-50 dark:bg-slate-900/20 backdrop-blur-sm transition-colors duration-500 overflow-hidden">
                <div className="container mx-auto px-4 text-center">
                    <span className="text-4xl block mb-4">📸</span>
                    <p className="text-slate-500 dark:text-slate-400">Activity Hub coming soon.</p>
                </div>
            </section>
        );
    }

    // Duplicate items three times to ensure the animation loops seamlessly.
    const marqueeItems = [...items, ...items, ...items];

    return (
        <section id="gallery" className="py-24 relative border-t border-slate-900/10 dark:border-white/5 bg-slate-50 dark:bg-slate-900/20 backdrop-blur-sm transition-colors duration-500 overflow-hidden">
            {/* Heading — stays centered */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <p className="text-sm font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">Activity Hub</p>
                    <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white transition-colors duration-500">
                        Moments in Action
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-6" />
                </div>
            </div>

            {/* Full-width marquee strip */}
            <div className="relative w-full overflow-hidden mt-4">
                {/* Left fade edge */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent" />
                {/* Right fade edge */}
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent" />

                <div
                    className="flex gap-6 px-6 w-max"
                    style={{ animation: 'marquee 50s linear infinite' }}
                >
                    {marqueeItems.map((item, index) => (
                        <div
                            key={`${item._id}-${index}`}
                            className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] flex-shrink-0 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg group/card"
                        >
                            <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                                sizes="(max-width: 768px) 300px, 400px"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <span className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">{item.category}</span>
                                <h3 className="text-white font-bold text-lg md:text-xl leading-tight whitespace-normal">{item.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333333%); }
                }
                
                /* Pause marquee on hover */
                #gallery .w-max:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
