"use client";
import { useState } from "react";
import IntroAnimation from "@/components/IntroAnimation";

export default function ClientIntroWrapper() {
    // Always start visible — shows on every load and reload
    const [done, setDone] = useState(false);

    if (done) return null;
    return <IntroAnimation onComplete={() => setDone(true)} />;
}
