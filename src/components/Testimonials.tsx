"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
    {
        quote: "PNT Robotics transformed our assembly line with their custom automation platform. Our throughput increased by 40% in just three months.",
        author: "Sarah Jenkins",
        role: "Operations Director",
        company: "TechManufacture Inc."
    },
    {
        quote: "The autonomous robotics systems provided by PNT have set a new industry standard. Their hardware solutions are robust and highly reliable.",
        author: "David Chen",
        role: "Chief Technology Officer",
        company: "Global Logistics Ltd."
    },
    {
        quote: "Their team doesn't just deliver special purpose machines; they deliver a complete, integrated software solution that gives us full control.",
        author: "Elena Rodriguez",
        role: "Plant Manager",
        company: "AeroParts Automation"
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 relative bg-transparent transition-colors duration-500">
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

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.15 }}
                            className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-shadow group"
                        >
                            <Quote className="w-10 h-10 text-cyan-500/20 absolute top-6 right-6 group-hover:text-cyan-500/40 transition-colors" />
                            <div className="relative z-10">
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-8 italic">
                                    "{testimonial.quote}"
                                </p>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">{testimonial.author}</h4>
                                    <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">{testimonial.role}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 uppercase tracking-wider">{testimonial.company}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
