"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ProductSpotlightProps {
  images: string[];
}

export default function ProductSpotlight({ images }: ProductSpotlightProps) {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-cyan-900/20 border border-slate-700 bg-slate-800 flex flex-col items-center justify-center group">
        <div className="text-center p-6 text-slate-400">
          <svg className="w-20 h-20 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-bold text-lg mb-1">Product images loading…</p>
          <p className="text-sm opacity-70">Copy images to <code>public/products/</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-cyan-900/20 border border-slate-700 bg-slate-900 group">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 opacity-70 pointer-events-none" />

      {/* Main Image */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: fade ? 1 : 0 }}
      >
        <Image
          src={images[current]}
          alt={`Product ${current + 1}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFade(false); setTimeout(() => { setCurrent(i); setFade(true); }, 300); }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-cyan-400 w-6" : "bg-white/40 hover:bg-white/70"}`}
            aria-label={`Show product ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
        {current + 1} / {images.length}
      </div>
    </div>
  );
}
