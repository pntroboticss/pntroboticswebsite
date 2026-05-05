"use client";

import { Box } from "lucide-react";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function MobileARButton() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (!isMobile) return null;

    return (
        <div className="w-full flex justify-center mt-6">
            <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js" strategy="lazyOnload" />

            {/* Hidden model-viewer used purely for standardizing AR cross-platform for iOS Quick Look */}
            {/* @ts-ignore - Custom Web Component */}
            <model-viewer
                id="agv-ar-viewer"
                src="/model.glb"
                ar
                ar-modes="scene-viewer quick-look"
                reveal="manual"
                style={{ display: "none" }}
            />

            <button
                onClick={(e) => {
                    e.preventDefault();
                    
                    // Force precise Intent URL for Android to prevent browser WebXR freezes
                    if (/android/i.test(navigator.userAgent)) {
                        const modelUrl = new URL("/model.glb", window.location.origin).toString();
                        window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${modelUrl}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`;
                        return;
                    }

                    // Native fallback for iOS Safari (requires model-viewer to convert GLB to USDZ)
                    const viewer = document.getElementById("agv-ar-viewer") as any;
                    if (viewer && typeof viewer.activateAR === "function") {
                        viewer.activateAR();
                    }
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl md:rounded-full font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:scale-105 active:scale-95 group border border-white/10"
            >
                <Box className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Click to view our AGV in AR</span>
            </button>
        </div>
    );
}
