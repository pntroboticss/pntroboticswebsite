"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            const { data, error } = await supabase
                .from("client_testimonials")
                .select("*")
                .eq("is_active", true)
                .order("created_at", { ascending: false });
                
            if (!error && data && data.length > 0) {
                setTestimonials(data);
            } else {
                // Fallback to dummy testimonials if DB is empty
                setTestimonials([
                    {
                        id: "dummy-1",
                        quote: "PNT Robotics completely transformed our assembly line. Their automated systems increased our production efficiency by 40% while reducing error rates to near zero.",
                        author: "Rajesh Kumar",
                        role: "Plant Operations Director",
                        company: "Tata Motors",
                        photo_url: null
                    },
                    {
                        id: "dummy-2",
                        quote: "The autonomous mobile robots (AMRs) provided by PNT have revolutionized our warehouse logistics. Incredible precision and seamless integration with our existing software.",
                        author: "Sarah Jenkins",
                        role: "Head of Logistics",
                        company: "Global Supply Chain Ltd",
                        photo_url: null
                    },
                    {
                        id: "dummy-3",
                        quote: "Their defense robotics platforms are state-of-the-art. The ruggedness and reliability of their systems in extreme conditions are unmatched in the Indian robotics sector.",
                        author: "Col. Vikram Singh",
                        role: "Procurement Officer",
                        company: "Defense Research Dept",
                        photo_url: null
                    },
                    {
                        id: "dummy-4",
                        quote: "Implementing PNT's robotic arms in our packaging facility was the best investment we made this year. The ROI was achieved in just 8 months.",
                        author: "Amit Patel",
                        role: "Chief Operating Officer",
                        company: "Wockhardt Pharma",
                        photo_url: null
                    }
                ]);
            }
            setIsLoading(false);
        };
        fetchTestimonials();
    }, []);

    // Auto-rotate if more than 3 testimonials
    useEffect(() => {
        if (testimonials.length <= 3) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        
        return () => clearInterval(interval);
    }, [testimonials.length]);

    // Get the 3 visible testimonials (with wrapping)
    const getVisibleTestimonials = () => {
        if (testimonials.length === 0) return [];
        if (testimonials.length <= 3) return testimonials;
        
        const extended = [...testimonials, ...testimonials];
        return extended.slice(currentIndex, currentIndex + 3);
    };

    const visibleTestimonials = getVisibleTestimonials();

    if (isLoading) return null; // Or a skeleton loader
    if (testimonials.length === 0) return null; // Don't show section if empty

    return (
        <section className="py-24 relative bg-transparent transition-colors duration-500 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 dark:text-white"
                    >
                        Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">Testimonials</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
                    >
                        See what our partners have to say about our industrial automation and robotics solutions.
                    </motion.p>
                </div>

                {/* Desktop Grid / Carousel */}
                <div className="hidden md:flex justify-center max-w-6xl mx-auto gap-8 relative">
                    <AnimatePresence mode="popLayout">
                        {visibleTestimonials.map((testimonial, idx) => (
                            <motion.div
                                key={`${testimonial.id}-${currentIndex + idx}`}
                                layout
                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                                transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                                className="w-1/3 relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-shadow group flex flex-col justify-between"
                            >
                                <Quote className="w-10 h-10 text-cyan-500/20 absolute top-6 right-6 group-hover:text-cyan-500/40 transition-colors" />
                                <div className="relative z-10 mb-8">
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic line-clamp-6">
                                        "{testimonial.quote}"
                                    </p>
                                </div>
                                <div className="relative z-10 flex items-center gap-4 mt-auto">
                                    {testimonial.photo_url ? (
                                        <img 
                                            src={testimonial.photo_url} 
                                            alt={testimonial.author} 
                                            className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700" 
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xl border-2 border-slate-200 dark:border-slate-700">
                                            {testimonial.author.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{testimonial.author}</h4>
                                        <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium mt-0.5">{testimonial.role}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{testimonial.company}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Mobile View (Single Card Carousel) */}
                <div className="md:hidden flex justify-center w-full px-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={testimonials[currentIndex]?.id || 'empty'}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="w-full relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl"
                        >
                            <Quote className="w-8 h-8 text-cyan-500/20 absolute top-6 right-6" />
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic mb-8 relative z-10">
                                "{testimonials[currentIndex]?.quote}"
                            </p>
                            <div className="flex items-center gap-4 relative z-10 mt-auto">
                                {testimonials[currentIndex]?.photo_url ? (
                                    <img 
                                        src={testimonials[currentIndex]?.photo_url} 
                                        alt={testimonials[currentIndex]?.author} 
                                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700" 
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xl border-2 border-slate-200 dark:border-slate-700">
                                        {testimonials[currentIndex]?.author?.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{testimonials[currentIndex]?.author}</h4>
                                    <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium mt-0.5">{testimonials[currentIndex]?.role}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{testimonials[currentIndex]?.company}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}
