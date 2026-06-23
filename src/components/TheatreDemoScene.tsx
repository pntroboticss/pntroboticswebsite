"use client";

import { useEffect, useState, useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { getProject } from "@theatre/core";
import { editable as e, SheetProvider } from "@theatre/r3f";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import { useScroll, motion, useTransform } from "framer-motion";

let studioInitialized = false;

// The project and sheet (which holds our timeline)
const project = getProject("AGV Cinematic Project");
const sheet = project.sheet("Main Scene");

function RobotModel() {
    const { scene } = useGLTF("/agv.glb");
    
    // We traverse the model and force physical properties so it actually reacts to our studio lighting!
    useMemo(() => {
        scene.traverse((child: any) => {
            if (child.isMesh && child.material) {
                // Force the material to be highly metallic and glossy
                child.material.metalness = 0.8;
                child.material.roughness = 0.15;
                
                // Darken the base color slightly so it doesn't look washed out
                if (child.material.color) {
                    child.material.color.multiplyScalar(0.6); // Darkens by 40%
                }
                
                // Enable shadows
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    return (
        <e.group theatreKey="AGV Robot">
            {/* Reduced scale from 15 to 10 so it fits perfectly in a car-style frame */}
            <primitive object={scene} scale={10} />
        </e.group>
    );
}

// This component takes over the camera and flies it around the robot as you scroll
function CinematicCamera({ scrollYProgress }: { scrollYProgress: any }) {
    useFrame(({ camera, clock }) => {
        const progress = scrollYProgress.get(); 
        const time = clock.getElapsedTime(); 
        
        // --- 360 DEGREE FAST SHOWCASE ---
        // 1. Angle: Do 1.25 full rotations (450 degrees) so the user sees every single side
        const angle = progress * (Math.PI * 2.5);
        
        // 2. Height: Swoop from a top-down view (6m), down to the chassis (1m), and back up slightly
        const height = 4 - Math.sin(progress * Math.PI) * 3;

        // 3. Radius: Start extremely close (7m), pull back to 11m in the middle, and push back in.
        // This ensures the robot fills the screen instead of looking tiny.
        const radius = 7 + Math.sin(progress * Math.PI) * 4;

        // Drifting effect
        const driftX = Math.sin(time * 0.5) * 0.5;
        const driftY = Math.cos(time * 0.4) * 0.3;

        camera.position.x = Math.sin(angle) * radius + driftX;
        camera.position.z = Math.cos(angle) * radius;
        camera.position.y = height + driftY;
        
        // Cine Roll
        const rollAngle = Math.sin(progress * Math.PI) * 0.25;
        camera.up.set(Math.sin(rollAngle), Math.cos(rollAngle), 0);
        
        camera.lookAt(0, 1 + Math.sin(time * 0.3) * 0.1, 0);
    });
    return null;
}

export default function TheatreDemoScene() {
    const [isReady, setIsReady] = useState(false);
    const { scrollYProgress } = useScroll();

    useEffect(() => {
        if (!studioInitialized) {
            studio.extend(extension);
            // studio.initialize() is synchronous in recent versions and returns void
            studio.initialize();
            setIsReady(true);
            studioInitialized = true;
        } else {
            setIsReady(true);
        }
    }, []);

    if (!isReady) return <div className="h-screen w-full flex items-center justify-center text-white bg-black">Loading Theatre Studio...</div>;

    return (
        <div className="w-full bg-black relative">
            
            <div className="sticky top-0 h-screen w-full bg-black z-0">
                <Canvas>
                    <SheetProvider sheet={sheet}>
                        <CinematicCamera scrollYProgress={scrollYProgress} />
                        <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />

                        {/* --- DRAMATIC AUTOMOTIVE STUDIO LIGHTING --- */}
                        <ambientLight intensity={0.1} /> 
                        <directionalLight position={[10, 10, 5]} intensity={4} color="#ffffff" castShadow />
                        <directionalLight position={[-10, 5, -5]} intensity={1.5} color="#93c5fd" />
                        <directionalLight position={[0, 2, -15]} intensity={5} color="#ffffff" />

                        <Environment preset="studio" />

                        <Suspense fallback={null}>
                            <RobotModel />
                        </Suspense>

                        <ContactShadows resolution={1024} scale={30} blur={3} opacity={0.8} far={10} color="#000000" />
                    </SheetProvider>
                </Canvas>
            </div>
            
            {/* --- HTML SCROLLING SECTIONS (Fast Hero Reveal) --- */}
            <div className="relative z-10 w-full pointer-events-none">
                
                {/* 
                    We massively compressed the height. Instead of 400vh, 
                    the whole experience is just 150vh so it flies by quickly for a Hero section.
                */}
                <div className="h-[75vh] w-full flex flex-col items-center justify-end text-center p-8 pb-12">
                    <h1 className="text-5xl md:text-8xl font-black text-white drop-shadow-2xl">Meet the AGV.</h1>
                    <p className="text-xl md:text-3xl text-slate-300 font-bold mt-4 drop-shadow-lg">Precision Engineered.</p>
                </div>

                <div className="h-[75vh] w-full flex flex-col items-center justify-end text-center p-8 pb-32">
                    <h2 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-2xl">100% Autonomous.</h2>
                    <button className="mt-8 px-10 py-4 bg-white text-black text-xl font-bold rounded-full pointer-events-auto hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        Discover More
                    </button>
                </div>

            </div>
        </div>
    );
}
