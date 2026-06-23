"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import * as THREE from "three";
// @ts-ignore
import WAVES from "vanta/dist/vanta.waves.min";

export default function VantaBackground() {
    const [vantaEffect, setVantaEffect] = useState<any>(null);
    const vantaRef = useRef<HTMLDivElement>(null);
    const { theme, systemTheme } = useTheme();

    useEffect(() => {
        const currentTheme = theme === "system" ? systemTheme : theme;
        const isDark = currentTheme === "dark";

        if (!vantaEffect && vantaRef.current) {
            const effect = WAVES({
                el: vantaRef.current,
                THREE: THREE,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: isDark ? 0x0f172a : 0xe2e8f0, // The wave mesh color
                shininess: 40.00,
                waveHeight: 20.00,
                waveSpeed: 0.80,
                zoom: 0.85
            });
            setVantaEffect(effect);
        }

        // Cleanup on unmount
        return () => {
            if (vantaEffect) {
                vantaEffect.destroy();
                setVantaEffect(null);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update colors when theme changes
    useEffect(() => {
        if (vantaEffect) {
            const currentTheme = theme === "system" ? systemTheme : theme;
            const isDark = currentTheme === "dark";
            vantaEffect.setOptions({
                color: isDark ? 0x0f172a : 0xe2e8f0,
            });
        }
    }, [theme, systemTheme, vantaEffect]);

    return (
        <div 
            ref={vantaRef} 
            className="fixed inset-0 z-[-1] transition-colors duration-500 bg-slate-50 dark:bg-slate-950"
        />
    );
}
