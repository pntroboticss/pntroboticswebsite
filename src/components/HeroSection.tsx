"use client";

import dynamic from "next/dynamic";

// Dynamically import Hero3D with SSR disabled to prevent hydration mismatches
const Hero3D = dynamic(() => import("./Hero3D"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-900/10 dark:bg-slate-100/10 animate-pulse rounded-3xl" />
});

export default function HeroSection() {
    return <Hero3D />;
}
