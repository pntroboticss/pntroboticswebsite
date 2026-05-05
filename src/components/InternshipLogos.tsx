"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getLiveInternships } from "@/lib/actions/db";

export default function InternshipLogos() {
    const [logos, setLogos] = useState<any[]>([]);

    useEffect(() => {
        getLiveInternships().then(setLogos).catch(console.error);
    }, []);

    if (logos.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 w-full mt-8">
                <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700/50 rounded-2xl w-full max-w-2xl text-center backdrop-blur-sm bg-white/30 dark:bg-black/10">
                    <p className="text-slate-500 dark:text-slate-400 mb-2 text-lg font-medium">No internship logos found yet.</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        To add logos automatically, register them via your <br />
                        <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-blue-600 dark:text-blue-400 font-bold mx-1">
                            Admin Dashboard
                        </code>
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 italic">This section will automatically display them here upon page refresh.</p>
                </div>

                {/* Fallback Static Logic so the layout doesn't look empty when developing */}
                <div className="flex flex-wrap justify-center gap-x-16 gap-y-12 opacity-90 dark:opacity-80 transition-all duration-700 mt-12 mb-8 pointer-events-none">
                    <div className="text-2xl font-bold tracking-widest text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer">INDIAN ARMY</div>
                    <div className="text-2xl font-bold tracking-widest text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer">INDIAN NAVY</div>
                    <div className="text-2xl font-bold tracking-widest text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer">DRDO</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-12 opacity-90 dark:opacity-80 transition-all duration-700 mt-10">
            {logos.map((logo, index) => (
                <div key={index} className="relative h-16 w-32 md:h-24 md:w-48 transition-transform hover:scale-110 flex items-center justify-center filter drop-shadow-sm">
                    <Image
                        src={logo.imageUrl}
                        alt={`Internship Logo ${index + 1}`}
                        fill
                        className="object-contain"
                    />
                </div>
            ))}
        </div>
    );
}
