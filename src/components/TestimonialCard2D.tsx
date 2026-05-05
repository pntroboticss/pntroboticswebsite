"use client";

import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";

export default function TestimonialCard2D({ testimonial }: { testimonial: any }) {
    return (
        <div className="flex flex-col md:flex-row bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 w-full max-w-5xl mx-auto">
            
            {/* Image Section (Left on Desktop, Top on Mobile) */}
            <div className="relative w-full md:w-2/5 h-[300px] md:h-auto shrink-0 bg-slate-100 dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
                {testimonial.imageUrl ? (
                    <Image
                        src={testimonial.imageUrl}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 40vw"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 text-slate-400 dark:text-slate-500 overflow-hidden">
                        {/* Abstract shapes for kids without photos */}
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 dark:bg-blue-900/40 rounded-full blur-2xl" />
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-200 dark:bg-purple-900/40 rounded-full blur-2xl" />
                        
                        <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-4xl font-bold text-blue-500 mb-4 border border-slate-100 dark:border-slate-700 relative z-10">
                            {testimonial.name.charAt(0)}
                        </div>
                    </div>
                )}

                {/* Optional School / Org Logo overlaid on top right of the image/avatar */}
                {testimonial.logoUrl && (
                    <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 dark:border-slate-800 overflow-hidden p-2">
                        <img src={testimonial.logoUrl} alt="Logo" className="object-contain w-full h-full" />
                    </div>
                )}
                
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-[2.5rem]" />
            </div>

            {/* Content Section (Right on Desktop, Bottom on Mobile) */}
            <div className="relative p-8 md:p-12 flex flex-col justify-center w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <Quote className="absolute top-8 right-8 w-24 h-24 text-blue-500/5 dark:text-blue-400/5 -rotate-12 pointer-events-none" />
                
                <div className="relative z-10 mb-8">
                    <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-200 leading-relaxed font-medium italic">
                        "{testimonial.quote}"
                    </p>
                </div>
                
                <div className="relative z-10 mt-auto flex items-center gap-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                    <div className="w-12 h-1 bg-blue-500 rounded-full shrink-0" />
                    <div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{testimonial.name}</h4>
                        <p className="text-blue-500 dark:text-blue-400 font-semibold text-sm tracking-wide mt-1 uppercase">{testimonial.role}</p>
                    </div>
                </div>
            </div>
            
        </div>
    );
}
