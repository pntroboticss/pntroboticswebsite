"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TestimonialCard2D from "./TestimonialCard2D";

export default function TestimonialsSlider({ staticData, category = "employee", title = "Teacher Testimonials", subtitle = "What Educators Say" }: { staticData?: any[], category?: "employee" | "lab" | "college" | "kids" | "schools", title?: string, subtitle?: string }) {
    const [testimonials, setTestimonials] = useState<any[]>(staticData || []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        fetch(`/api/admin/testimonials?page=${category}`)
            .then(r => r.json())
            .then(data => { 
                if (Array.isArray(data) && data.length > 0) {
                    setTestimonials(data);
                } else if (staticData && staticData.length > 0) {
                    setTestimonials(staticData);
                }
            })
            .catch(err => {
                console.error(err);
                if (staticData && staticData.length > 0) {
                    setTestimonials(staticData);
                }
            });
    }, [staticData, category]);


    const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    useEffect(() => {
        if (!isAutoPlaying || testimonials.length <= 1) return;
        const interval = setInterval(next, 6000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, testimonials.length]);

    if (testimonials.length === 0) {
        return null; // Hide section entirely if no user testimonials exist to keep the website looking pristine.
    }

    return (
        <section className="py-24 relative border-t border-slate-900/10 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40 transition-colors duration-500 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <p className="text-sm font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">{subtitle}</p>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white transition-colors duration-500">
                        {title}
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-6" />
                </div>

                <div
                    className="max-w-4xl mx-auto relative"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    <div className="min-h-[300px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="w-full relative z-10"
                            >
                                <TestimonialCard2D testimonial={testimonials[currentIndex]} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    {testimonials.length > 1 && (
                        <>
                            <button
                                onClick={prev}
                                className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-500 hover:scale-110 transition-all z-20"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={next}
                                className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-500 hover:scale-110 transition-all z-20"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Dots */}
                    {testimonials.length > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentIndex ? "bg-blue-600 w-8" : "bg-slate-300 dark:bg-slate-600"}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
