"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function RotatingStars() {
    const groupRef = useRef<THREE.Group>(null);
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1; // standard WebGL Y inversion
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        
        // Slow constant rotation
        groupRef.current.rotation.y += delta * 0.05;
        groupRef.current.rotation.x += delta * 0.02;

        // Reactive mouse rotation for depth
        const targetX = mouse.current.y * 0.1;
        const targetY = mouse.current.x * 0.1;

        groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
        groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.05;
    });

    return (
        <group ref={groupRef}>
            <Stars 
                radius={100} 
                depth={50} 
                count={5000} 
                factor={4} 
                saturation={0} 
                fade 
                speed={1} 
            />
        </group>
    );
}

export default function GalaxyBackground() {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDark = currentTheme === "dark";

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-slate-900 dark:bg-[#020617] transition-colors duration-500">
            {/* Ambient glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-400/20 dark:bg-cyan-500/20 rounded-full blur-[80px]" />

            <div className="absolute inset-0 mobile-safe-canvas opacity-80">
                <Canvas camera={{ position: [0, 0, 1] }}>
                    <RotatingStars />
                </Canvas>
            </div>
            
            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.8)_100%)] mix-blend-multiply opacity-80 pointer-events-none" />
        </div>
    );
}
