"use client";
import Image from "next/image";

export default function GallerySlider({ images }: { images: string[] }) {
    if (!images || images.length === 0) {
        return (
            <section className="py-24 relative bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center">
                <span className="text-4xl block mb-4">📸</span>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    The photo gallery is currently empty.<br/>
                    Drop your images into the <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">public/gallery</code> folder and they will automatically appear here!
                </p>
            </section>
        );
    }

    // Duplicate items to ensure seamless infinite scroll
    const marqueeItems = [...images, ...images, ...images];

    return (
        <section className="py-24 relative border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10 text-center mb-16">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Innovation in Action</h2>
                <div className="w-16 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto" />
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent" />

                <div className="flex gap-6 px-6 w-max animate-gallery-marquee hover:[animation-play-state:paused]">
                    {marqueeItems.map((img, i) => (
                        <div key={i} className="relative w-[300px] h-[250px] md:w-[450px] md:h-[350px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800/80 group">
                            <Image
                                src={img}
                                alt={`Gallery Image ${i}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 300px, 450px"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes galleryMarquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333333%); }
                }
                .animate-gallery-marquee {
                    animation: galleryMarquee 75s linear infinite;
                }
            `}} />
        </section>
    );
}
