"use client";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getLiveAboutPhotos } from "@/lib/actions/db";

interface Photo {
    _id: string;
    imageUrl: string;
    caption?: string;
}

export default function AboutSlider() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        getLiveAboutPhotos().then(setPhotos).catch(console.error);
    }, []);

    const prev = useCallback(() => setCurrent((c) => (c === 0 ? Math.max(0, photos.length - 1) : c - 1)), [photos.length]);
    const next = useCallback(() => setCurrent((c) => (c === Math.max(0, photos.length - 1) ? 0 : c + 1)), [photos.length]);

    // Auto-advance every 4 seconds
    useEffect(() => {
        if (photos.length <= 1) return;
        const timer = setInterval(next, 4000);
        return () => clearInterval(timer);
    }, [next, photos.length]);

    if (photos.length === 0) {
        return (
            <div className="w-full aspect-[4/3] rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-center p-8">
                <p className="text-slate-500 dark:text-slate-400 font-medium">Team photos coming soon!</p>
                <p className="text-sm text-slate-400 dark:text-slate-600 mt-2">Upload via Admin → About Section Photos</p>
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 group">
            {/* Images */}
            {photos.map((photo, i) => (
                <div
                    key={photo._id}
                    className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
                >
                    <img
                        src={photo.imageUrl}
                        alt={photo.caption || `Team photo ${i + 1}`}
                        className="w-full h-full object-cover"
                    />
                    {photo.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-4">
                            <p className="text-white text-sm font-medium">{photo.caption}</p>
                        </div>
                    )}
                </div>
            ))}

            {/* Controls */}
            {photos.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {photos.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white w-5" : "bg-white/50"}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
