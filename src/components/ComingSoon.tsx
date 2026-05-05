"use client";

import { Construction, Sparkles } from "lucide-react";

export default function ComingSoon({
    title = "Coming Soon",
    description = "We are currently building this section to provide you with an exceptional experience. Please check back later!"
}: {
    title?: string;
    description?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-4 text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl rotate-3 hover:rotate-6 transition-transform">
                    <Construction className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                    <Sparkles className="absolute -top-3 -right-3 w-6 h-6 text-yellow-500 animate-bounce" />
                </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {title}
            </h2>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {description}
            </p>

            <div className="mt-10 flex gap-4">
                <a href="/" className="px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-105 transition-transform shadow-lg">
                    Return Home
                </a>
            </div>
        </div>
    );
}
