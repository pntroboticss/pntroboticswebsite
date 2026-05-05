"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function BootcampCTA({ bootcampLink = "https://forms.gle/" }: { bootcampLink?: string }) {
    return (
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 border-t border-white/10">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] -top-40 -left-20"></div>
                <div className="absolute w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] bottom-10 -right-20"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 p-10 md:p-16 rounded-[3rem] shadow-2xl"
                >
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold text-sm tracking-wider uppercase rounded-full mb-6 shadow-lg transform -rotate-2">
                        Limited Time Offer
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-md">
                        Ready to Ignite Innovation?
                    </h2>
                    <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Experience the future of education firsthand. Book a free, no-obligation demo or sign up for our upcoming bootcamp.
                    </p>

                    <a
                        href={bootcampLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center justify-center px-8 py-5 text-lg font-bold text-indigo-900 bg-white rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] cursor-pointer"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white via-blue-50 to-white group-hover:bg-gradient-to-r group-hover:from-blue-100 group-hover:via-white group-hover:to-blue-100 transition-all"></div>
                        <span className="relative flex items-center gap-2">
                            Book a Free Demo / Bootcamp
                            <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </span>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
