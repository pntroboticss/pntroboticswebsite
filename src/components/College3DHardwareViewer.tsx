"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import { ChevronLeft, ChevronRight, Box, RotateCcw } from "lucide-react";

// Known built-in models — admin can add more via the DB
export const BUILTIN_MODELS = [
    { id: "agv", name: "Autonomous Guided Vehicle (AGV)", modelPath: "/model.glb", description: "Interactive 3D structural model of the Autonomous Guided Vehicle base." },
];

// A stable, glitch-free model renderer using primitives directly
// Avoids the AGV component's conflicting mouse-tracking useFrame
function StableModelScene({ modelPath }: { modelPath: string }) {
    const groupRef = useRef<THREE.Group>(null);
    // Load the GLTF scene directly — bypasses AGV's own conflicting useFrame animation
    const { scene } = useGLTF(modelPath);
    // Clone the scene to avoid shared state between multiple instances
    const clonedScene = scene.clone();

    // Single, smooth slow auto-rotation — no mouse tracking, no conflicts
    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.35;
        }
    });

    return (
        <group ref={groupRef} position={[0, -0.8, 0]} rotation={[0.1, 0, 0]}>
            <primitive object={clonedScene} scale={7} />
        </group>
    );
}

function Lighting() {
    return (
        <>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 10, 5]} intensity={2.5} />
            <directionalLight position={[-5, 5, -5]} intensity={1} color="#6366f1" />
            <pointLight position={[0, 6, 0]} intensity={0.8} color="#818cf8" />
            <Environment preset="city" />
        </>
    );
}

function LoadingFallback() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Loading 3D Model...</p>
            </div>
        </div>
    );
}

interface HardwareModel {
    id?: string;
    _id?: string;
    name: string;
    modelPath: string;
    description: string;
}

interface College3DHardwareViewerProps {
    extraModels?: HardwareModel[];
}

export default function College3DHardwareViewer({ extraModels = [] }: College3DHardwareViewerProps) {
    const allModels = [
        ...BUILTIN_MODELS,
        ...extraModels.map(m => ({ ...m, id: m.id || m._id || m.name }))
    ];
    const [activeIndex, setActiveIndex] = useState(0);
    const [key, setKey] = useState(0); // force canvas remount on model change
    const active = allModels[activeIndex];

    const handlePrev = () => {
        setActiveIndex((i) => (i - 1 + allModels.length) % allModels.length);
        setKey(k => k + 1);
    };

    const handleNext = () => {
        setActiveIndex((i) => (i + 1) % allModels.length);
        setKey(k => k + 1);
    };

    const handleDot = (i: number) => {
        setActiveIndex(i);
        setKey(k => k + 1);
    };

    return (
        // isolation: isolate ensures the WebGL canvas never bleeds into other stacking contexts
        <div className="w-full rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-900 dark:to-indigo-950/40 shadow-xl"
            style={{ isolation: "isolate", position: "relative", zIndex: 0 }}
        >
            {/* Label overlay */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 pointer-events-none">
                <div className="inline-block bg-blue-100/90 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold tracking-widest uppercase text-[10px] md:text-xs px-3 py-1.5 rounded-full mb-1.5 border border-blue-200 dark:border-blue-500/30 backdrop-blur-sm">
                    Interactive Hardware
                </div>
                <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white drop-shadow-sm leading-tight">{active.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-0.5 max-w-[200px] md:max-w-xs leading-snug">{active.description}</p>
                <p className="text-[10px] md:text-xs text-blue-500 dark:text-blue-400 mt-1.5 opacity-70 flex items-center gap-1">
                    <RotateCcw className="w-3 h-3" /> Drag to rotate
                </p>
            </div>

            {/* Model count badge */}
            {allModels.length > 1 && (
                <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10 flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full px-2.5 py-1 border border-slate-200 dark:border-slate-700">
                    <Box className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span className="text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-300">{activeIndex + 1} / {allModels.length}</span>
                </div>
            )}

            {/* Viewer Area: Handles both 3D GLB/GLTF models and static 2D images smoothly */}
            <div className="h-[320px] sm:h-[400px] md:h-[520px] w-full cursor-grab active:cursor-grabbing relative" style={{ display: "block" }}>
                {active.modelPath.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                    <div className="w-full h-full p-8 md:p-16 flex items-center justify-center">
                        <div className="relative w-full h-full drop-shadow-2xl hover:scale-105 transition-transform duration-500 ease-out">
                            {/* Standard image rendering imported from next/image via direct tag to avoid import conflict if not imported */}
                            <img 
                                src={active.modelPath} 
                                alt={active.name} 
                                className="w-full h-full object-contain pointer-events-none"
                            />
                        </div>
                    </div>
                ) : (
                    <Canvas
                        key={key}
                        camera={{ position: [0, 1.2, 5], fov: 42 }}
                        gl={{ antialias: true, alpha: true }}
                        style={{ display: "block", width: "100%", height: "100%" }}
                        frameloop="always"
                    >
                        <Suspense fallback={null}>
                            <Lighting />
                            <StableModelScene modelPath={active.modelPath} />
                            <OrbitControls
                                enableZoom={true}
                                maxDistance={9}
                                minDistance={2.5}
                                enablePan={false}
                                minPolarAngle={Math.PI / 8}
                                maxPolarAngle={Math.PI / 2}
                                // Don't auto rotate — StableModelScene handles it so no conflicts
                                autoRotate={false}
                            />
                        </Suspense>
                    </Canvas>
                )}
            </div>

            {/* Navigation dots/arrows — only shown when there are multiple models */}
            {allModels.length > 1 && (
                <div className="relative z-10 flex items-center justify-center gap-3 py-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={handlePrev}
                        className="p-1.5 md:p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors shadow-sm"
                        aria-label="Previous model"
                    >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-slate-600 dark:text-slate-300" />
                    </button>

                    <div className="flex gap-1.5 items-center">
                        {allModels.map((m, i) => (
                            <button
                                key={m.id}
                                onClick={() => handleDot(i)}
                                className={`transition-all rounded-full ${i === activeIndex ? "w-5 h-1.5 bg-indigo-500" : "w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 hover:bg-indigo-400"}`}
                                aria-label={`View ${m.name}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        className="p-1.5 md:p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors shadow-sm"
                        aria-label="Next model"
                    >
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                </div>
            )}
        </div>
    );
}
