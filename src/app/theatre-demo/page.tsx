"use client";

import dynamic from "next/dynamic";

const TheatreDemoScene = dynamic(() => import("@/components/TheatreDemoScene"), { 
    ssr: false,
    loading: () => <div className="w-full h-full flex flex-col items-center justify-center text-white bg-slate-950 font-mono text-sm tracking-widest"><div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>LOADING 3D SCENE...</div>
});

export default function TheatreDemoPage() {
    return (
        <main className="w-full h-screen bg-black overflow-hidden">
            <TheatreDemoScene />
        </main>
    );
}
