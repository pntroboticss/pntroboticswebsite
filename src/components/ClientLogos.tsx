"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getLiveSchools } from "@/lib/actions/db";

export default function ClientLogos() {
    const [logos, setLogos] = useState<any[]>([]);

    useEffect(() => {
        getLiveSchools().then(setLogos).catch(console.error);
    }, []);

    if (logos.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 w-full mt-8 overflow-hidden">
                <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700/50 rounded-2xl w-full max-w-2xl text-center backdrop-blur-sm bg-white/30 dark:bg-black/10">
                    <p className="text-slate-500 dark:text-slate-400 mb-2 text-lg font-medium">No school logos found yet.</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        To add logos automatically, register them via your <br />
                        <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-purple-600 dark:text-purple-400 font-bold mx-1">
                            Admin Dashboard
                        </code>
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 italic">This section will automatically display them here upon page refresh.</p>
                </div>

                {/* Fallback Static Logic so the layout doesn't look empty when developing */}
                <div className="w-full flex items-center justify-center mt-12 mb-8 opacity-80 dark:opacity-60 transition-all duration-700 px-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl items-center justify-items-center">
                        {['THE RAJAS INTERNATIONAL SCHOOL', 'ORION ICSE', 'DSK SCHOOL', 'MRIS', 'BITS PILANI', 'Vishwashanti Gurukul', 'sloka International', 'NES International'].map((school, i) => (
                            <div key={i} className="w-full flex items-center justify-center px-4 py-3 md:px-6 md:py-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs md:text-sm font-bold tracking-wide text-slate-700 dark:text-slate-300 bg-white shadow-sm dark:bg-slate-900 border-opacity-50 dark:border-opacity-50 text-center">
                                {school}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center mt-10 px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-12 w-full max-w-7xl items-center justify-items-center opacity-80 dark:opacity-60 transition-all duration-700">
                {logos.map((logo, index) => (
                    <div key={index} className="relative h-20 w-32 md:h-28 md:w-48 transition-transform hover:scale-110 flex items-center justify-center filter drop-shadow-sm group">
                        <Image
                            src={logo.imageUrl}
                            alt={`School Logo ${index}`}
                            fill
                            className="object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
