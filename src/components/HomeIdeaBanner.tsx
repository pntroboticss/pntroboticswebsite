"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import CustomProjectModal from "./CustomProjectModal";

export default function HomeIdeaBanner() {
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

    return (
        <section className="py-12 bg-transparent transition-colors duration-500">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <button 
                        onClick={() => setIsCustomModalOpen(true)}
                        className="group relative w-full overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 to-purple-600 p-[2px] hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 scale-100 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 bg-white dark:bg-slate-900 px-6 sm:px-8 py-6 sm:py-8 rounded-[2rem] group-hover:bg-blue-50/50 dark:group-hover:bg-slate-800/80 transition-all duration-300">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                                <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                                    <Lightbulb className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1">Have a unique idea?</h3>
                                    <p className="text-base text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">Click here to submit a custom project request</p>
                                </div>
                            </div>
                            <div>
                                <span className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-400 text-base font-bold group-hover:bg-blue-600 group-hover:text-white shadow-sm transition-all duration-300">
                                    Start Project
                                </span>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <CustomProjectModal 
                isOpen={isCustomModalOpen} 
                onClose={() => setIsCustomModalOpen(false)} 
            />
        </section>
    );
}
