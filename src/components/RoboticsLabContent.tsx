"use client";
import React, { useState, useRef, useEffect, Suspense, useMemo, Component, ErrorInfo, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Microchip, Radar, MonitorPlay, Cog, School, University, Star, Quote, Truck, Hand, Plane, Award } from "lucide-react";
import Image from "next/image";
import { SectionCAlumni, LabPartnersSection } from "./CollegesTrainingContent";

// -------------------------------------------------------------
// IntersectionObserver Lazy Canvas Wrapper
// Prevents WebGL Context limits by only mounting Canvas when visible
// -------------------------------------------------------------
function LazyCanvas({ children, className = "" }: { children: ReactNode, className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { rootMargin: "300px" }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className={`w-full h-full relative ${className}`}>
            {isVisible && children}
        </div>
    );
}

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, ContactShadows, Environment, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
// Gallery is fetched via the API route to avoid calling a server action from a client component
import Script from "next/script";
import { useSearchParams, useRouter } from "next/navigation";

// Hook to detect mobile
function useIsMobile() {
    const [isMounted, setIsMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        const check = () => setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return isMounted ? isMobile : false;
}

export default function RoboticsLabContent({ initialTab = "schools" }: { initialTab?: "schools" | "colleges" }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"schools" | "colleges">(
        initialTab === "colleges" ? "colleges" : "schools"
    );

    useEffect(() => {
        if (initialTab === "colleges" || initialTab === "schools") {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    const handleTabChange = (tab: "schools" | "colleges") => {
        setActiveTab(tab);
        // Persist in URL so reload restores the correct tab
        const params = new URLSearchParams(window.location.search);
        params.set("tab", tab);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    // Define tabs data for the new structure
    const tabs = [
        { id: "schools", label: "For Schools", icon: School },
        { id: "colleges", label: "For Colleges", icon: University },
    ];

    return (
        <>
            {/* Load model-viewer script unconditionally at the top to prevent Hydration mismatches */}
            <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js" strategy="lazyOnload" />

            {/* --- Hero Section --- */}
            <div className="relative flex flex-col items-center justify-center text-center min-h-[420px] pt-32 pb-16 overflow-hidden bg-black">
                {/* Full lab photo */}
                <img
                    src="/images/robotics-lab/1.jpeg"
                    alt="Robotics Lab"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                {/* Just a subtle dark vignette at the bottom so text stays readable */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

                <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-5 sm:mb-6 tracking-tight text-white text-center leading-tight"
                    >
                        Industrial Robotics{" "}
                        <span className="text-cyan-300">Lab Setup</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                        className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 font-normal text-center"
                    >
                        Choose your institution type below to view our specialized curriculum and hardware configurations.
                    </motion.p>

                    {/* Tab switcher */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex justify-center"
                    >
                        <div className="inline-flex bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-1.5 relative shadow-lg">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id as "schools" | "colleges")}
                                        className={`relative z-10 px-8 py-3 text-base font-bold rounded-full transition-all duration-300 ${isActive
                                                ? "text-blue-800"
                                                : "text-white/80 hover:text-white"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}

                            {/* Animated white active pill */}
                            <motion.div
                                className="absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] rounded-full bg-white shadow-md z-0"
                                initial={false}
                                animate={{ left: activeTab === "schools" ? "0.375rem" : "50%" }}
                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>


            {/* Dynamic Content Rendering */}
            <div className="relative w-full pb-20">
                <AnimatePresence mode="wait">
                    {activeTab === "schools" ? (
                        <motion.div
                            key="schools"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.5 }}
                        >
                            <SchoolsContent />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="colleges"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.5 }}
                        >
                            <CollegesContent />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <LabGallerySection />
        </>
    );
}

// -------------------------------------------------------------
// Interactive 3D Hardware Model Component — uses real GLB files
// -------------------------------------------------------------

class ModelErrorBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
    constructor(props: any) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error("3D Model Error:", error, errorInfo); }
    render() { if (this.state.hasError) return this.props.fallback; return this.props.children; }
}

// Auto-normalizing GLB model: synchronously centers and scales to fill the viewport
// flightStyle: "hover" = gentle centered hover (school), "circular" = circular orbit path (college)
function GlbModel({ path, targetSize = 5, flightStyle = "hover" }: { path: string; targetSize?: number; flightStyle?: "hover" | "circular" }) {
    const { scene, animations } = useGLTF(path);
    const groupRef = useRef<THREE.Group>(null);
    const { actions } = useAnimations(animations, groupRef);

    useEffect(() => {
        if (actions) {
            Object.values(actions).forEach(action => action?.play());
        }
    }, [actions]);

    // Clone, scale, and center the scene ONCE before it ever renders
    const clonedScene = useMemo(() => {
        const cloned = scene.clone(true);

        // Fix materials: ensure textures have proper color space
        cloned.traverse((child: any) => {
            if (child.isMesh && child.material) {
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                mats.forEach((mat: any) => {
                    if (mat.map) {
                        mat.map.colorSpace = THREE.SRGBColorSpace;
                        mat.map.needsUpdate = true;
                    }
                    if (mat.emissiveMap) {
                        mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
                        mat.emissiveMap.needsUpdate = true;
                    }
                });
            }
        });

        // First pass: scale to target size
        const box = new THREE.Box3().setFromObject(cloned);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0.0001) {
            cloned.scale.setScalar(targetSize / maxDim);
        }
        // Second pass: re-center AFTER scaling so the pivot is dead center
        const box2 = new THREE.Box3().setFromObject(cloned);
        const center = new THREE.Vector3();
        box2.getCenter(center);
        cloned.position.sub(center);
        return cloned;
    }, [scene, targetSize]);

    const isDrone = path.toLowerCase().includes("tello");

    // Drone physics state
    const propSpeed = useRef(0); // 0 = stopped, 1 = full

    useFrame((state, delta) => {
        if (groupRef.current && !isDrone) {
            // Ground robots gently rotate on turntable
            groupRef.current.rotation.y += delta * 0.35;
        } else if (groupRef.current && isDrone) {

            if (flightStyle === "circular") {
                // ── CIRCULAR FLIGHT (college section) ─────────────────────────
                const cycleDuration = 12.0;
                const t = state.clock.elapsedTime % cycleDuration;

                let desiredPropSpeed = 0;
                let targetX = 0, targetY = 0, targetZ = 0;
                let targetRotX = 0, targetRotZ = 0;

                if (t < 1.5) {
                    // LANDED
                    targetY = -0.1;
                    desiredPropSpeed = 0;
                } else if (t < 2.5) {
                    // SPOOL UP
                    desiredPropSpeed = Math.min(1, (t - 1.5) / 1.0);
                    targetY = -0.05 + (t - 1.5) * 0.15;
                } else if (t < 9.5) {
                    // CIRCULAR ORBIT
                    desiredPropSpeed = 1;
                    const ft = t - 2.5;
                    const angle = (ft / 7.0) * Math.PI * 2; // full circle
                    const radius = 0.8;
                    targetX = Math.sin(angle) * radius;
                    targetZ = Math.cos(angle) * radius;
                    targetY = 0.5 + Math.sin(ft * 1.2) * 0.1;
                    // Bank into the turn
                    targetRotZ = -Math.cos(angle) * 0.12;
                    targetRotX = Math.sin(angle) * 0.08;
                } else if (t < 10.5) {
                    // RETURN TO CENTER
                    const p = (t - 9.5) / 1.0;
                    desiredPropSpeed = 1.0 - p * 0.3;
                    targetY = 0.3;
                } else {
                    // LANDING + SPOOL DOWN
                    const lp = (t - 10.5) / 1.5;
                    desiredPropSpeed = Math.max(0, 1 - lp * 1.4);
                    targetY = Math.max(-0.1, 0.3 * (1 - lp));
                }

                // Smooth prop speed
                const isSpinningDown = desiredPropSpeed < propSpeed.current;
                const propAlpha = isSpinningDown ? Math.min(1, delta * 1.8) : Math.min(1, delta * 5);
                propSpeed.current += (desiredPropSpeed - propSpeed.current) * propAlpha;

                if (actions) {
                    Object.values(actions).forEach(action => {
                        if (action) action.timeScale = propSpeed.current * 1.2;
                    });
                }

                const posLerp = Math.min(1, delta * 3.5);
                groupRef.current.position.x += (targetX - groupRef.current.position.x) * posLerp;
                groupRef.current.position.y += (targetY - groupRef.current.position.y) * posLerp;
                groupRef.current.position.z += (targetZ - groupRef.current.position.z) * posLerp;

                const rotLerp = Math.min(1, delta * 5);
                groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * rotLerp;
                groupRef.current.rotation.z += (targetRotZ - groupRef.current.rotation.z) * rotLerp;

            } else {
                // ── GENTLE HOVER (school section / default) ──────────────────
                const cycleDuration = 9.0;
                const t = state.clock.elapsedTime % cycleDuration;

                let desiredPropSpeed = 0;
                let targetX = 0, targetY = 0, targetZ = 0;
                let targetRotX = 0, targetRotZ = 0;

                if (t < 2.0) {
                    targetY = -0.1;
                    desiredPropSpeed = 0;
                } else if (t < 2.8) {
                    desiredPropSpeed = Math.min(1, (t - 2.0) / 0.8);
                    targetY = 0;
                } else if (t < 7.4) {
                    const flightTime = t - 2.8;
                    targetX = Math.sin(flightTime * 0.8) * 0.15;
                    targetY = 0.5 + Math.sin(flightTime * 1.5) * 0.08;
                    targetZ = Math.cos(flightTime * 0.8) * 0.08;
                    targetRotX = Math.sin(flightTime * 3) * 0.04;
                    targetRotZ = Math.cos(flightTime * 3) * 0.04;
                    desiredPropSpeed = 1;
                } else if (t < 8.2) {
                    desiredPropSpeed = 1.0 - (t - 7.4) / 0.8 * 0.3;
                    targetY = 0.3;
                } else {
                    const lp = (t - 8.2) / 0.8;
                    desiredPropSpeed = Math.max(0, 1 - lp * 1.5);
                    targetY = Math.max(-0.1, 0.3 * (1 - lp));
                }

                const isSpinningDown = desiredPropSpeed < propSpeed.current;
                const propAlpha = isSpinningDown ? Math.min(1, delta * 1.8) : Math.min(1, delta * 5);
                propSpeed.current += (desiredPropSpeed - propSpeed.current) * propAlpha;

                if (actions) {
                    Object.values(actions).forEach(action => {
                        if (action) action.timeScale = propSpeed.current * 1.2;
                    });
                }

                const posLerp = Math.min(1, delta * 3.5);
                groupRef.current.position.x += (targetX - groupRef.current.position.x) * posLerp;
                groupRef.current.position.y += (targetY - groupRef.current.position.y) * posLerp;
                groupRef.current.position.z += (targetZ - groupRef.current.position.z) * posLerp;

                const rotLerp = Math.min(1, delta * 5);
                groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * rotLerp;
                groupRef.current.rotation.z += (targetRotZ - groupRef.current.rotation.z) * rotLerp;
            }
        }
    });

    return (
        <group ref={groupRef}>
            <primitive object={clonedScene} />
        </group>
    );
}

// Simple wrapper: receives the glb path directly
function HardwareModel({ path }: { path: string }) {
    return <GlbModel path={path} targetSize={4} />;
}

function PrinterModel() {
    return <GlbModel path="/models/3d_printer_2.0.glb" targetSize={6.0} />;
}

function DrillModel() {
    return <GlbModel path="/models/dewalt_drill.glb" targetSize={5.0} />;
}

function WrenchModel() {
    return <GlbModel path="/models/toolkit_3D.glb" targetSize={5.0} />;
}

function AngleGrinderModel() {
    return <GlbModel path="/models/angle_grinder.glb" targetSize={5.0} />;
}

function SpannerModel() {
    return <GlbModel path="/models/spanner.glb" targetSize={5.0} />;
}

function VernierModel() {
    return <GlbModel path="/models/verniercaliper.glb" targetSize={5.0} />;
}

function WrenchSizeModel() {
    return <GlbModel path="/models/wrench_size_24_tools.glb" targetSize={5.0} />;
}

function HumanoidModel() {
    return <GlbModel path="/models/hr-os1_humanoid_robot_kit_-_endo_v1.0.glb" targetSize={9.0} />;
}

// Mechanical Lab models — the new ones the user added
const MECH_MODELS = [
    { path: "/models/angle_grinder.glb", label: "Angle Grinder", targetSize: 5.0 },
    { path: "/models/spanner.glb", label: "Spanner", targetSize: 5.0 },
    { path: "/models/verniercaliper.glb", label: "Vernier Caliper", targetSize: 5.0 },
    { path: "/models/wrench_size_24_tools.glb", label: "Wrench Set", targetSize: 5.0 },
];

function MechModel({ path, targetSize }: { path: string; targetSize: number }) {
    return <GlbModel path={path} targetSize={targetSize} />;
}

function MechanicalLabSection() {
    const isMobile = useIsMobile();
    const [modelIdx, setModelIdx] = useState(0);

    // Auto-cycle through models every 3 s (same as Electronics Lab)
    useEffect(() => {
        const t = setInterval(() => setModelIdx(i => (i + 1) % MECH_MODELS.length), 3000);
        return () => clearInterval(t);
    }, []);

    const current = MECH_MODELS[modelIdx];

    return (
        <section className="mb-24">
            <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-widest mb-4">🔩 Lab 3</span>
                <h2 className="text-3xl md:text-5xl font-black mb-4">Mechanical Lab</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Hands-on engineering fundamentals — where students get real exposure to tools, materials, and mechanical systems.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-center">
                {/* Cards on the Left */}
                <div className="grid sm:grid-cols-2 gap-5 order-2 lg:order-1">
                    {[
                        { icon: "🔩", title: "Precision Tools", desc: "Vernier calipers, micrometers, and measuring instruments for accurate fabrication.", color: "from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900", border: "border-slate-200 dark:border-slate-700" },
                        { icon: "🪛", title: "Workstations", desc: "Professional grade workbenches with vises, clamps, and full hand toolsets.", color: "from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900", border: "border-blue-100 dark:border-blue-800/30" },
                        { icon: "⚡", title: "Power Tools", desc: "Drilling machines, angle grinders, and bench grinders for material shaping.", color: "from-yellow-50 to-slate-50 dark:from-yellow-900/20 dark:to-slate-900", border: "border-yellow-100 dark:border-yellow-800/30" },
                        { icon: "🏗️", title: "Structural Assembly", desc: "Aluminium extrusion systems, fasteners, and frame construction kits.", color: "from-emerald-50 to-slate-50 dark:from-emerald-900/20 dark:to-slate-900", border: "border-emerald-100 dark:border-emerald-800/30" },
                        { icon: "⚙️", title: "Gear & Drive Systems", desc: "Gears, pulleys, belts, and chain drives for understanding mechanical advantage.", color: "from-purple-50 to-slate-50 dark:from-purple-900/20 dark:to-slate-900", border: "border-purple-100 dark:border-purple-800/30" },
                        { icon: "🛡️", title: "Safety Training", desc: "PPE, machine guarding, safe operating procedures, and lab safety protocols.", color: "from-red-50 to-slate-50 dark:from-red-900/20 dark:to-slate-900", border: "border-red-100 dark:border-red-800/30" },
                    ].map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                            className={`bg-gradient-to-br ${item.color} rounded-2xl border ${item.border} p-6 hover:-translate-y-1 hover:shadow-lg transition-all`}>
                            <div className="text-4xl mb-4">{item.icon}</div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-2">{item.title}</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Right: 3D Slideshow — cycles through new models */}
                <div className="h-[400px] lg:h-[520px] w-full relative flex items-center justify-center order-1 lg:order-2">
                    {/* Decorative glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-slate-500/10 dark:bg-slate-400/5 rounded-full blur-[60px] pointer-events-none" />

                    <LazyCanvas className="absolute inset-0 mobile-safe-canvas">
                        <Canvas
                            shadows
                            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0, powerPreference: "high-performance" }}
                            camera={{ position: isMobile ? [8, 6, 14] : [6, 5, 12], fov: isMobile ? 48 : 38 }}
                            frameloop={isMobile ? "demand" : "always"}
                            dpr={1}
                        >
                            <ambientLight intensity={0.4} />
                            <spotLight position={[10, 10, 10]} intensity={1.5} angle={0.2} castShadow />
                            <directionalLight position={[10, 10, 5]} intensity={1.2} />
                            <directionalLight position={[-10, -10, -5]} intensity={0.4} />
                            <Environment preset="warehouse" />
                            <Suspense fallback={null}>
                                <MechModel path={current.path} targetSize={current.targetSize} />
                            </Suspense>
                            <ContactShadows position={[0, -2.5, 0]} opacity={0.35} scale={10} blur={2.5} far={5} resolution={256} frames={1} />
                            {!isMobile && <OrbitControls makeDefault autoRotate autoRotateSpeed={1.2} enableZoom={false} minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 1.8} />}
                        </Canvas>
                    </LazyCanvas>

                    {/* Model label */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
                        <div className="bg-slate-900/60 dark:bg-black/60 backdrop-blur-md border border-white/10 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xl">
                            {current.label}
                        </div>
                    </div>

                    {/* Carousel dots */}
                    <div className="absolute top-4 right-4 flex gap-2 pointer-events-none z-10">
                        {MECH_MODELS.map((_, i) => (
                            <div key={i} className={`h-2 rounded-full transition-all ${i === modelIdx ? "w-6 bg-slate-600 dark:bg-slate-300" : "w-2 bg-slate-300 dark:bg-white/30"}`} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function PrinterLabSection() {
    const isMobile = useIsMobile();
    return (
        <section className="mb-24">
            <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest mb-4">🖨️ Lab 2</span>
                <h2 className="text-3xl md:text-5xl font-black mb-4">3D Printer Lab</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">From digital blueprints to physical reality — students design, slice, and print their own inventions.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-center">
                {/* Interactive 3D Printer Visual */}
                <div className="flex flex-col gap-6">
                    <div className="relative flex items-center justify-center h-[500px] cursor-grab active:cursor-grabbing">

                        <LazyCanvas className="absolute inset-0 mobile-safe-canvas">
                            <Canvas
                                shadows
                                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0, powerPreference: "high-performance" }}
                                camera={{ position: isMobile ? [15, 6, 15] : [10, 4, 10], fov: isMobile ? 50 : 40 }}
                                frameloop={isMobile ? "demand" : "always"}
                                dpr={1}
                            >
                                <ambientLight intensity={0.4} />
                                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
                                <directionalLight position={[10, 10, 5]} intensity={1.2} />
                                <directionalLight position={[-10, -10, -5]} intensity={0.4} />
                                <Environment preset="studio" />
                                <Suspense fallback={null}>
                                    <PrinterModel />
                                </Suspense>
                                {!isMobile && <OrbitControls makeDefault autoRotate autoRotateSpeed={1} enableZoom={false} />}
                            </Canvas>
                        </LazyCanvas>


                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
                            <span className="bg-orange-500/90 backdrop-blur text-white text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                                👆 Drag to rotate
                            </span>
                        </div>
                    </div>
                </div>

                {/* Feature cards */}
                <div className="flex flex-col gap-4">
                    {[
                        { icon: "🎨", title: "CAD Design Training", desc: "Students learn Tinkercad & Fusion 360 to design custom 3D models from scratch." },
                        { icon: "🔧", title: "FDM & Resin Printers", desc: "Exposure to both FDM (PLA/ABS) and Resin printers for different material properties." },
                        { icon: "⚙️", title: "Slicing & Settings", desc: "Learn layer height, infill, supports, and print speed optimization with Cura/PrusaSlicer." },
                        { icon: "🏆", title: "Project-Based Output", desc: "Students print drone frames, robot parts, and custom enclosures for their projects." },
                    ].map((f, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                            className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-2xl">{f.icon}</div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white mb-0.5">{f.title}</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// -------------------------------------------------------------
// State 1: For Schools
// -------------------------------------------------------------
// Preload known GLB models so they start downloading immediately and don't stall the UI
// Only preload smaller files to avoid blocking bandwidth
useGLTF.preload("/models/arduino_uno.glb");       // 1.2 MB
useGLTF.preload("/models/esp8266.glb");            // 0.3 MB
useGLTF.preload("/models/pir_sensor.glb");         // 0.1 MB
useGLTF.preload("/models/MQ2_sensor.glb");         // 1.1 MB
useGLTF.preload("/models/bo_battery_operated_motor.glb"); // 0.3 MB
useGLTF.preload("/models/DOFBOT.glb");             // Mini Robotic Arm
// Advance_AGV.glb (204MB) and Advance_Robotic_Arm.glb (107MB) load on-demand — too large to preload

// All hardware categories — each has its model file paths
const HARDWARE_ITEMS = [
    {
        title: "Core Controllers",
        subtitle: "Arduino Uno / ESP8266 / Raspberry Pi",
        icon: Microchip,
        desc: "From basic logic to AI-grade computing — the heart of every project.",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        border: "border-blue-500",
        models: ["/models/arduino_uno.glb", "/models/esp8266.glb", "/models/raspberry_pi_1k.glb"],
    },
    {
        title: "Smart Sensors",
        subtitle: "PIR Motion / MQ-2 Gas / DHT11 Temp",
        icon: Radar,
        desc: "Real-world input — motion detection, gas sensing, temperature & humidity monitoring.",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        border: "border-purple-500",
        models: ["/models/pir_sensor.glb", "/models/MQ2_sensor.glb", "/models/DHT11_sensor_compressed.glb"],
    },
    {
        title: "Displays & Modules",
        subtitle: "16x2 LCD / OLED 128x64",
        icon: MonitorPlay,
        desc: "Human-machine interfaces for interactive visual output and data display.",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500",
        models: ["/models/display_lcd_16x2_compressed.glb", "/models/display_oled_128x64.glb"],
    },
    {
        title: "Motors & Actuators",
        subtitle: "SG90 Servo / Stepper Motor / BO Motor",
        icon: Cog,
        desc: "Physical movement — servo arms, wheel drives, stepper precision.",
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        iconColor: "text-orange-600 dark:text-orange-400",
        border: "border-orange-500",
        models: ["/models/bo_battery_operated_motor.glb", "/models/servomotor_sg90_compressed.glb", "/models/aula_28_-_motor_de_passo_compressed.glb"],
    },
];

const INDUSTRIAL_ROBOTS = [
    {
        title: "Basic AGV",
        subtitle: "Automated guided vehicles for smart warehouse and factory floor automation.",
        icon: Truck,
        models: ["/model.glb"],
        iconBg: "bg-red-500/10",
        iconColor: "text-red-500",
        border: "border-red-500/50 hover:border-red-500",
    },
    {
        title: "Robotic Hand",
        subtitle: "Educational dexterous manipulation and research platform.",
        icon: Hand,
        models: [],
        iconBg: "bg-violet-500/10",
        iconColor: "text-violet-500",
        border: "border-violet-500/50 hover:border-violet-500",
    },
    {
        title: "PNT Mini Drone",
        subtitle: "A PNT-customized aerial platform — fully programmable AI drone.",
        icon: Plane,
        models: ["/models/dji_tello.glb"],
        iconBg: "bg-sky-500/10",
        iconColor: "text-sky-500",
        border: "border-sky-500/50 hover:border-sky-500",
    },
    {
        title: "Mini/Basic Robotic Arm",
        subtitle: "Built on customizable integrated circuits — enabling circuit-level customization.",
        icon: Cog,
        models: ["/models/DOFBOT.glb"],
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-500",
        border: "border-blue-500/50 hover:border-blue-500",
    },
];

function IndustrialRobotLabSection() {
    const isMobile = useIsMobile();
    const [activeCat, setActiveCat] = useState(0);

    const currentItem = INDUSTRIAL_ROBOTS[activeCat];
    const currentModel = currentItem.models[0] ?? null;

    return (
        <section className="mb-24">
            <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-xs font-black uppercase tracking-widest mb-4">🤖 Lab 4</span>
                <h2 className="text-3xl md:text-5xl font-black mb-6">Industrial Robot Lab</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">The future of industrial automation relies on versatile robotics. Students program, interact with, and study industrial-grade AGVs, drones, robotic hands, and robotic arms.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-stretch">
                {/* Left: Category cards */}
                <div className="flex flex-col gap-4">
                    {INDUSTRIAL_ROBOTS.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveCat(i)}
                            onMouseEnter={() => setActiveCat(i)}
                            className={`text-left p-6 rounded-3xl transition-all duration-300 flex items-center gap-6 ${activeCat === i
                                    ? `bg-white dark:bg-slate-900 shadow-xl scale-105 z-10 relative ring-2 ${item.border.split(' ')[0].replace('border', 'ring')}`
                                    : "bg-slate-50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:scale-[1.02]"
                                }`}
                        >
                            <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center ${item.iconBg} ${item.iconColor}`}>
                                <item.icon className="w-8 h-8" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">{item.subtitle}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Right: 3D Canvas */}
                <div className="h-[400px] lg:h-[600px] w-full relative flex items-center justify-center mobile-safe-canvas">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-[60px] pointer-events-none" />

                    {currentModel ? (
                        <>
                            <LazyCanvas className="absolute inset-0 outline-none">
                                <Canvas
                                    camera={{ position: isMobile ? [7, 5, 7] : [5, 4, 5], fov: isMobile ? 50 : 40 }}
                                    gl={{ antialias: true, powerPreference: "high-performance" }}
                                    frameloop={isMobile ? "demand" : "always"}
                                    dpr={1}
                                    style={{ outline: "none" }}
                                >
                                    <ambientLight intensity={0.4} />
                                    <directionalLight position={[5, 8, 5]} intensity={1.0} />
                                    <directionalLight position={[-3, -2, -4]} intensity={0.3} />
                                    <Environment preset="warehouse" />
                                    <Suspense fallback={null}>
                                        <HardwareModel path={currentModel} />
                                    </Suspense>
                                    {!isMobile && <OrbitControls makeDefault target={[0, 0, 0]} enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />}
                                </Canvas>
                            </LazyCanvas>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
                                <div className="bg-slate-900/60 dark:bg-black/60 backdrop-blur-md border border-white/10 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xl">
                                    {currentItem.title}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-10 bg-slate-900/5 dark:bg-white/5 rounded-3xl w-full h-full border border-slate-200 dark:border-slate-800">
                            <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center mb-5">
                                <currentItem.icon className="w-10 h-10 text-slate-400" />
                            </div>
                            <p className="text-slate-500 font-semibold text-sm mb-1">3D Model Coming Soon</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function SchoolsContent() {
    const isMobile = useIsMobile();
    const [activeCat, setActiveCat] = useState(0);
    const [modelIdx, setModelIdx] = useState(0);

    const currentCategory = HARDWARE_ITEMS[activeCat];
    const availableModels = currentCategory.models;
    const currentModel = availableModels[modelIdx] ?? null;

    // Auto-slideshow: cycle through models in the active category every 3s
    useEffect(() => {
        if (availableModels.length <= 1) return;
        const t = setInterval(() => {
            setModelIdx(i => (i + 1) % availableModels.length);
        }, 3000);
        return () => clearInterval(t);
    }, [activeCat, availableModels.length]);

    // Reset modelIdx when category changes
    useEffect(() => { setModelIdx(0); }, [activeCat]);

    return (
        <div className="container mx-auto px-4 py-20 max-w-7xl">
            {/* Section 1: The Principle */}
            <section className="mb-24 text-center max-w-4xl mx-auto">
                <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase mb-4 block">The Principle</span>
                <h2 className="text-3xl md:text-5xl font-black mb-8 text-slate-900 dark:text-white">Empowering the Next Generation of Innovators</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                    Our school labs are built on the core philosophy of hands-on learning and deep STEM integration.
                    We bridge the gap between textbook physics and real-world engineering, preparing students for the careers of tomorrow.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <span className="px-6 py-3 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-xl font-bold flex items-center gap-2 shadow-sm">
                        <CheckCircle2 className="w-5 h-5" /> NEP 2020 Aligned
                    </span>
                    <span className="px-6 py-3 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-xl font-bold flex items-center gap-2 shadow-sm">
                        <CheckCircle2 className="w-5 h-5" /> Hands-on STEM
                    </span>
                    <span className="px-6 py-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-xl font-bold flex items-center gap-2 shadow-sm">
                        <CheckCircle2 className="w-5 h-5" /> Project Based
                    </span>
                </div>
            </section>

            {/* Section 2: Electronics Lab with real GLB models */}
            <section className="mb-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-6">The Electronics Lab</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">Select a category to explore the hardware in 3D.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-stretch">
                    {/* Left: Category cards */}
                    <div className="flex flex-col gap-4">
                        {HARDWARE_ITEMS.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveCat(i)}
                                onMouseEnter={() => setActiveCat(i)}
                                className={`text-left p-6 rounded-3xl transition-all duration-300 flex items-center gap-6 ${activeCat === i
                                        ? `bg-white dark:bg-slate-900 shadow-xl scale-105 z-10 relative ring-2 ${item.border.split(' ')[0].replace('border', 'ring')}`
                                        : "bg-slate-50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:scale-[1.02]"
                                    }`}
                            >
                                <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center ${item.iconBg} ${item.iconColor}`}>
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed truncate">{item.subtitle}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right: 3D Canvas — no container bg, floats seamlessly */}
                    <div className="h-[400px] lg:h-[600px] w-full relative flex items-center justify-center mobile-safe-canvas">
                        {/* Decorative background circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-[60px] pointer-events-none" />

                        {currentModel ? (
                            <>
                                <LazyCanvas className="absolute inset-0 outline-none">
                                    <Canvas
                                        camera={{ position: isMobile ? [7, 5, 7] : [5, 4, 5], fov: isMobile ? 50 : 40 }}
                                        gl={{ antialias: true, powerPreference: "high-performance" }}
                                        frameloop={isMobile ? "demand" : "always"}
                                        dpr={1}
                                        style={{ outline: "none" }}
                                    >
                                        <ambientLight intensity={0.4} />
                                        <directionalLight position={[5, 8, 5]} intensity={1.0} />
                                        <directionalLight position={[-3, -2, -4]} intensity={0.3} />
                                        <Environment preset="warehouse" />
                                        <Suspense fallback={null}>
                                            <HardwareModel path={currentModel} />
                                        </Suspense>
                                        {!isMobile && <OrbitControls makeDefault target={[0, 0, 0]} enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />}
                                    </Canvas>
                                </LazyCanvas>
                                {/* Model label overlay */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
                                    <div className="bg-slate-900/60 dark:bg-black/60 backdrop-blur-md border border-white/10 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xl">
                                        {currentCategory.title} · {currentCategory.subtitle.split("/")[modelIdx]?.trim()}
                                    </div>
                                </div>
                                {/* Slideshow dots */}
                                {availableModels.length > 1 && (
                                    <div className="absolute top-4 right-4 flex gap-2 pointer-events-none z-10">
                                        {availableModels.map((_, i) => (
                                            <div key={i} className={`h-2 rounded-full transition-all ${i === modelIdx ? "w-6 bg-blue-500" : "w-2 bg-slate-300 dark:bg-white/30"}`} />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            // Placeholder when no model available yet
                            <div className="flex flex-col items-center justify-center text-center p-10">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-5">
                                    <currentCategory.icon className="w-10 h-10 text-white/30" />
                                </div>
                                <p className="text-white/50 font-semibold text-sm mb-1">3D Model Coming Soon</p>
                                <p className="text-white/25 text-xs">Drop the GLB file in <span className="font-mono">public/models/</span></p>
                            </div>
                        )}
                    </div>
                </div>
            </section>


            {/* ===== 3D PRINTER LAB ===== */}
            <PrinterLabSection />

            {/* ===== MECHANICAL LAB ===== */}
            <MechanicalLabSection />

            {/* ===== INDUSTRIAL ROBOT LAB ===== */}
            <IndustrialRobotLabSection />
        </div>
    );
}


// -------------------------------------------------------------
// State 2: For Colleges — Full PDF Content
// -------------------------------------------------------------

// Product data for the solution grid
const PRODUCTS = [
    {
        icon: "",
        name: "PNT Mini/Basic Robotic Arm",
        specs: "6 DOF | Raspberry Pi 5 | 0.3MP Camera",
        tagline: "Unlike plug-and-play labs, our robots are built on customizable integrated circuits — enabling circuit-level customization, DOF expansion, and multi-robot integration.",
        features: ["Demonstration of pick and place automation", "Demonstration of gesture-controlled robotic arm", "Sensor Feedback Integration with robot arm", "Path Planning and Motion Control", "Object Detection using OpenCV", "Object Sorting by Colour & by Size", "Programming for Industrial Applications", "Integration with IoT for Remote Control", "AI integration with robot arm"],
        image: "/images/robotics-lab/robotic-arm.jpeg",
        glbPath: "/models/DOFBOT.glb",
        color: "from-blue-500 to-cyan-500",
        accentColor: "#38bdf8",
        extraSpecs: [
            "Dimensions: 500x500x573 mm | Weight: 10 kg", 
            "Actuators: 5 x 180° & 1 x 270° Bus Servo Motors (11kg/cm)",
            "Microcontroller: Raspberry Pi 5 with WiFi", 
            "Display: 0.96-inch OLED Display",
            "Camera: 0.3MP High-resolution Camera", 
            "Ports: 2x USB 2.0, 1x HDMI"
        ],
    },
    {
        icon: "",
        name: "PNT Advance Robotic Arm",
        specs: "6 DOF | ROS System | Depth Camera",
        tagline: "Advanced research robotic arm equipped with ROS and MoveIt simulation.",
        features: ["Forward & inverse kinematics programming", "Pick-and-place task execution", "MoveIt simulation integration", "Depth camera for complex AI object detection", "Multi-axis coordination under ROS"],
        image: "/images/robotics-lab/industrial-arm.png",
        glbPath: "/models/Advance_Robotic_Arm_safe.glb",
        color: "from-indigo-500 to-purple-500",
        accentColor: "#818cf8",
        extraSpecs: [
            "Dimensions: 310x420x900 mm | Weight: ~15kg",
            "Actuators: 6x High Torque Stepper motors, 1x Servo for gripper",
            "Control System: ROS System on Single Board Computer",
            "Sensors: Depth Camera (30 FPS, 90° FOV) for AI",
            "Pay Load: Max 250g (extended) / 350g (retracted)",
            "Simulation: Built-in MoveIt Simulation Software"
        ],
    },
    {
        icon: "",
        name: "PNT Mini/Basic Robotic Hand",
        specs: "6 DOF | ATmega328P | Capacitive Touch Sensor",
        tagline: "Advanced dexterous manipulation and prosthetic hand research platform.",
        features: ["Finger movement coordination", "Feedback mechanism demonstration", "EMG-based hand control", "Gesture-based hand control", "Prosthetic Hand Demonstration", "Haptic Feedback System", "AI-Based control of hand", "AI-based gesture control", "Integration with Wearable Tech", "Remote-controlled hand movement"],
        image: "/images/robotics-lab/robotic_hand.png",
        glbPath: null as string | null,
        color: "from-violet-500 to-pink-500",
        accentColor: "#c084fc",
        extraSpecs: [
            "Weight: 4 kg", 
            "Actuators: 6x 180° Servo Motors (11kg/cm)", 
            "Microcontroller: ATmega328P via USB 2.0", 
            "Sensors: Capacitive Touch Sensor", 
            "Interface: Rotary Encoder With Button, 16x2 LCD Display"
        ],
    },
    {
        icon: "",
        name: "PNT Mini Drone",
        specs: "Custom Firmware | 5MP HD720p30 | Vision System",
        tagline: "A PNT-customized aerial platform — we build our own software stack on top of the hardware, turning it into a fully programmable AI drone lab tool unique to every deployment.",
        features: [
            "PNT custom software layer for autonomous mission control",
            "SDK programming via PNT APIs — Python, Scratch & ROS bridges",
            "Autonomous takeoff, precision landing, and waypoint navigation",
            "Mission-pad based positioning with custom PNT coordinate logic",
            "AI-based object detection from aerial view (PNT Vision SDK)",
            "Face tracking and subject-following with PNT AI modules",
            "Obstacle avoidance using PNT-tuned vision pipeline",
            "Warehouse automation using custom QR/barcode logic",
            "Aerial Photography, Surveillance, and inspection missions",
            "PC dashboard application developed by PNT for fleet control",
        ],
        image: "/images/robotics-lab/agv.jpeg",
        glbPath: "/models/dji_tello.glb",
        color: "from-sky-500 to-cyan-400",
        accentColor: "#22d3ee",
        extraSpecs: [
            "Dimensions: 98×92.5×41 mm | Weight: 80g",
            "Flight: 13 min per battery (3 included) | Max Speed: 8m/s (Max Height: 30m)",
            "Camera: 5MP (2592×1936) HD720p30 with 720p Live View",
            "Hardware: Intel Processor, 2.4 GHz WiFi, Detachable 1.1Ah Fireproof Battery",
            "Sensors: Range Finder, Barometer, Optical Sensors"
        ],
    },
    {
        icon: "",
        name: "PNT Advance AMR",
        specs: "Mecanum Drive | Raspberry Pi 5 + Teensy 4.1 | LiDAR",
        tagline: "Next-generation Autonomous Mobile Robot for complex indoor and outdoor navigation.",
        features: ["Hardware interfacing and integration of sensors and actuators with ROS", "Odometry sensor data and teleoperation control", "Mapping indoor environments using LiDAR sensors", "Autonomous navigation with parameter tuning", "SLAM-based real-time mapping", "Multi-floor navigation capability"],
        image: "/images/robotics-lab/amr.jpeg",
        glbPath: "/models/Advance_AMR_compressed.glb",
        color: "from-emerald-500 to-teal-500",
        accentColor: "#34d399",
        extraSpecs: [
            "Dimensions: 415x510x282 mm | Weight: 10-11 kg",
            "Payload Capacity: 2 kg | Top Speed: 0.5 m/s",
            "Drive System: Mecanum Drive (4 wheels)",
            "Battery: 12V 12Ah Fireproof LiFePO4 (3 hours run time)",
            "Sensors: Encoder based motors, IMU, LIDAR, RGB Camera",
            "Control System: ROS System (Raspberry Pi 5 + Teensy 4.1)"
        ],
    },
    {
        icon: "",
        name: "PNT Standard AMR",
        specs: "Differential Drive | Raspberry Pi 5 | LiDAR",
        tagline: "Addressing real-world challenges in logistics and defense deployment scenarios.",
        features: ["Hardware interfacing and integration of sensors and actuators with ROS", "Odometry sensor data and teleoperation control for AMRs", "Mapping indoor environments using LiDAR sensors", "Autonomous navigation with parameter tuning"],
        image: "/images/robotics-lab/amr.jpeg",
        glbPath: "/models/Basic_AMR.glb",
        color: "from-orange-500 to-amber-500",
        accentColor: "#fb923c",
        extraSpecs: [
            "Dimensions: 300x356x328 mm | Weight: 5 kg",
            "Payload Capacity: 2 kg | Top Speed: 0.3 m/s",
            "Drive System: Differential Drive (2 wheels + 2 casters)",
            "Battery: 12V 12Ah Fireproof LiFePO4 (3 hours run time)",
            "Sensors: Encoder based motors, IMU, LIDAR, RGB Camera",
            "Control System: ROS System (Raspberry Pi 5)"
        ],
    },
    {
        icon: "",
        name: "PNT Basic AGV",
        specs: "Dual high-torque DC motors | 100 kg Payload | Line Following",
        tagline: "Automated guided vehicles for smart warehouse and factory floor automation.",
        features: ["Line following AGV demonstration", "Obstacle avoidance demonstration", "Automated goods transportation", "Speed and acceleration control", "Wireless & IoT-based Control"],
        image: "/images/robotics-lab/agv.jpeg",
        glbPath: "/model.glb",
        color: "from-red-500 to-rose-500",
        accentColor: "#f87171",
        extraSpecs: [
            "Dimensions: 800x500x200 mm | Weight: < 20 kg | Payload: Up to 100 kg",
            "Drive System: Dual DC motors with integrated encoders",
            "Navigation: 8-sensor pair line follower, Ultrasonic obstacle detection",
            "Processor: Dual-core microcontroller with Wi-Fi & Bluetooth",
            "Power: 12V Fireproof Rechargeable LiFePO4 Battery (Up to 6 hours)"
        ],
    },
    {
        icon: "",
        name: "PNT Advance AGV",
        specs: "SLAM Navigation | 100 kg Payload | ROS System",
        tagline: "Advanced SLAM-based Automated Guided Vehicle for independent dynamic pathfinding.",
        features: ["RFID-based navigation system", "SLAM-based real-time mapping", "Path planning via custom algorithms", "Automated goods transportation", "Integration of external sensors"],
        image: "/images/robotics-lab/agv.jpeg",
        glbPath: "/models/Advance_AGV_safe.glb",
        color: "from-rose-500 to-pink-500",
        accentColor: "#fb7185",
        extraSpecs: [
            "Dimensions: 800x500x200 mm | Weight: < 20 kg | Payload: Up to 100 kg",
            "Drive System: Dual DC motors with integrated encoders",
            "Navigation: Lidar Sensors for auto navigation and line independent movements",
            "Control System: ROS System on Single Board Computer (SLAM Technology)",
            "Power: 12V Fireproof Rechargeable LiFePO4 Battery (Up to 6 hours)"
        ]
    }
];

// HIRING_COMPANIES array removed as it is now fetched dynamically

// ---------------------------------------------------------------
// ProductMiniModel — small rotating 3D shape for the grid cards
// ---------------------------------------------------------------
function ProductMiniPlaceholder({ color, icon }: { color: string; icon: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) meshRef.current.rotation.y += delta * 0.8;
    });

    // Parse the first color from a Tailwind gradient string (e.g. "from-blue-500 to-cyan-500")
    const colorMap: Record<string, string> = {
        "#38bdf8": "#38bdf8",
        "#6366f1": "#6366f1",
        "#818cf8": "#818cf8",
        "#c084fc": "#c084fc",
        "#22d3ee": "#22d3ee",
        "#34d399": "#34d399",
        "#fb923c": "#fb923c",
        "#f87171": "#f87171",
        "#fb7185": "#fb7185",
    };

    // Just use the accentColor passed via the `color` prop
    const hex = colorMap[color] ?? "#38bdf8";

    return (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh ref={meshRef} castShadow>
                <octahedronGeometry args={[1.1, 0]} />
                <meshStandardMaterial
                    color={hex}
                    roughness={0.2}
                    metalness={0.7}
                    wireframe={false}
                />
            </mesh>
            {/* Inner core glow */}
            <mesh scale={0.65}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color={hex} emissive={hex} emissiveIntensity={0.6} roughness={0.1} metalness={0.9} />
            </mesh>
        </Float>
    );
}

function ProductMiniModelScene({ accentColor, glbPath }: { accentColor: string; glbPath: string | null }) {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((_, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.6;
    });
    if (glbPath) {
        return (
            <group ref={groupRef}>
                <ModelErrorBoundary fallback={<mesh><boxGeometry args={[1.5, 1.5, 1.5]} /><meshStandardMaterial color={accentColor} wireframe /></mesh>}>
                    <Suspense fallback={<ProductMiniPlaceholder color={accentColor} icon="" />}>
                        <GlbModel path={glbPath} targetSize={2.5} />
                    </Suspense>
                </ModelErrorBoundary>
            </group>
        );
    }
    return <ProductMiniPlaceholder color={accentColor} icon="" />;
}

function ProductMiniModel({ accentColor, glbPath, image }: { accentColor: string; glbPath: string | null; image: string }) {
    if (!glbPath) {
        return (
            <div className="w-full h-full flex items-center justify-center p-3 relative bg-white/40 dark:bg-slate-900/40 rounded-xl overflow-hidden backdrop-blur-sm">
                {/* Glow dot */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <div className="w-24 h-24 rounded-full blur-3xl opacity-30" style={{ background: accentColor }} />
                </div>
                <img src={image} alt="Product" className="w-[80%] h-[80%] object-contain drop-shadow-2xl mix-blend-multiply dark:mix-blend-normal z-10 hover:scale-105 transition-transform duration-500" />
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            <Canvas
                camera={{ position: [4, 3, 4], fov: 40 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                frameloop="always"
                dpr={1}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[3, 5, 3]} intensity={1.5} color={accentColor} />
                <directionalLight position={[-3, -2, -3]} intensity={0.3} />
                <Suspense fallback={null}>
                    <ProductMiniModelScene accentColor={accentColor} glbPath={glbPath} />
                </Suspense>
            </Canvas>
        </div>
    );
}

// ----------------------------------------------------------------
// ProductDetailModel3D — large isometric view in the detail cards
// Locked circular rotation, no user controls.
// On mobile: show a "Open Desktop Mode" message instead.
// ----------------------------------------------------------------
function IsometricRotatingModel({ accentColor }: { accentColor: string }) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.4;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Base platform */}
            <mesh position={[0, -1.3, 0]} receiveShadow>
                <cylinderGeometry args={[1.8, 2, 0.15, 64]} />
                <meshStandardMaterial color={accentColor} roughness={0.5} metalness={0.5} opacity={0.3} transparent />
            </mesh>

            {/* Main body */}
            <Float speed={1} rotationIntensity={0} floatIntensity={0.3}>
                <mesh position={[0, 0, 0]} castShadow>
                    <icosahedronGeometry args={[1.2, 1]} />
                    <meshStandardMaterial color={accentColor} roughness={0.15} metalness={0.8} />
                </mesh>
                {/* Inner glow sphere */}
                <mesh scale={0.55}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.2} roughness={0} metalness={1} />
                </mesh>
                {/* Orbiting ring */}
                <mesh rotation={[Math.PI / 4, 0, Math.PI / 6]}>
                    <torusGeometry args={[1.9, 0.04, 16, 80]} />
                    <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} roughness={0.2} metalness={0.9} />
                </mesh>
                {/* Second ring */}
                <mesh rotation={[-Math.PI / 5, Math.PI / 4, 0]}>
                    <torusGeometry args={[2.2, 0.03, 16, 80]} />
                    <meshStandardMaterial color="#ffffff" emissive={accentColor} emissiveIntensity={0.3} roughness={0.4} metalness={0.7} opacity={0.5} transparent />
                </mesh>
                {/* Corner cubes */}
                {[0, 1, 2, 3].map(i => (
                    <mesh
                        key={i}
                        position={[
                            Math.cos((i / 4) * Math.PI * 2) * 1.6,
                            Math.sin((i / 4) * Math.PI * 2) * 0.3,
                            Math.sin((i / 4) * Math.PI * 2) * 1.6,
                        ]}
                        castShadow
                    >
                        <boxGeometry args={[0.22, 0.22, 0.22]} />
                        <meshStandardMaterial color={accentColor} roughness={0.1} metalness={0.9} emissive={accentColor} emissiveIntensity={0.3} />
                    </mesh>
                ))}
            </Float>
        </group>
    );
}

function ProductDetailModel3D({ accentColor, glbPath, image }: { accentColor: string; glbPath: string | null; image: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Initialize canvas only when on screen (with a slight 200px buffer)
                setIsVisible(entry.isIntersecting);
            },
            { rootMargin: "200px" }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    if (!glbPath) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <div className="w-[300px] h-[300px] rounded-full blur-[100px]" style={{ background: accentColor }} />
                </div>
                {/* Notice object-contain here ensures transparent PNG backgrounds look perfect and floating */}
                <img src={image} alt="Product Detail" className="w-full h-full object-contain drop-shadow-2xl z-10 transition-transform duration-700 group-hover:scale-105" />
            </div>
        );
    }

    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8 text-center pointer-events-auto">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}44` }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9" style={{ color: accentColor }}>
                        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                    </svg>
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">View in AR</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">Point your camera at a flat surface to place the robot in your real environment.</p>

                {glbPath && (
                    <>
                        {/* @ts-ignore */}
                        <model-viewer
                            id={`ar-viewer-${glbPath.replace(/[^a-zA-Z0-9]/g, '-')}`}
                            src={glbPath}
                            ar
                            ar-modes="scene-viewer quick-look"
                            reveal="manual"
                            style={{ display: "none" }}
                        />

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (/android/i.test(navigator.userAgent)) {
                                    const modelUrl = new URL(glbPath, window.location.origin).toString();
                                    window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${modelUrl}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`;
                                    return;
                                }
                                const viewer = document.getElementById(`ar-viewer-${glbPath.replace(/[^a-zA-Z0-9]/g, '-')}`) as any;
                                if (viewer && typeof viewer.activateAR === "function") {
                                    viewer.activateAR();
                                }
                            }}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:scale-105 active:scale-95 group border border-white/10"
                        >
                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                            <span>Open in AR</span>
                        </button>
                    </>
                )}
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full h-full relative pointer-events-none">
            {/* 
              The Canvas is positioned absolute, expanded 50% in all directions so the drone can fly outside.
              Lazy loaded via isVisible to prevent WebGL context limits.
            */}
            {isVisible && (
                <div
                    className="absolute pointer-events-none"
                    style={{ inset: '-50%', zIndex: 10 }}
                >
                    <Canvas
                        shadows
                        camera={{
                            position: [5, 5, 5],
                            fov: 40,
                        }}
                        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.8, powerPreference: "high-performance" }}
                        frameloop="always"
                        dpr={1}
                        style={{ background: 'transparent', width: '100%', height: '100%' }}
                    >
                        <ambientLight intensity={0.25} />
                        <directionalLight position={[8, 12, 8]} intensity={1.0} castShadow color={accentColor} />
                        <directionalLight position={[-5, 5, -5]} intensity={0.4} />
                        <pointLight position={[0, 3, 0]} intensity={0.6} color={accentColor} />
                        <Environment preset="studio" />
                        <ModelErrorBoundary fallback={
                            <mesh position={[0, 0, 0]}>
                                <boxGeometry args={[2, 2, 2]} />
                                <meshStandardMaterial color={accentColor} wireframe />
                            </mesh>
                        }>
                            <Suspense fallback={null}>
                                {glbPath && <GlbModel path={glbPath} targetSize={glbPath.toLowerCase().includes('tello') ? 2.2 : 3.5} flightStyle={glbPath.toLowerCase().includes('tello') ? 'circular' : 'hover'} />}
                            </Suspense>
                        </ModelErrorBoundary>
                        <ContactShadows position={[0, -2.2, 0]} opacity={0.3} scale={20} blur={4} far={5} resolution={256} frames={1} />
                    </Canvas>
                </div>
            )}
        </div>
    );
}

function CollegesContent() {
    const [liveTestimonials, setLiveTestimonials] = useState<any[] | null>(null);
    const [labPartners, setLabPartners] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/admin/testimonials?page=lab")
            .then(r => r.json())
            .then(data => setLiveTestimonials(Array.isArray(data) ? data : []))
            .catch(() => setLiveTestimonials([]));
        fetch("/api/admin/lab-partners")
            .then(r => r.json())
            .then(data => setLabPartners(Array.isArray(data) ? data : []))
            .catch(() => setLabPartners([]));
    }, []);

    const fallbackTestimonials = [
        { name: "Gaurav Mishra", role: "Pillai College of Engineering", quote: "Completed a 6-month internship, contributed to building a robotic arm, and am now an AI & Robotics Engineer working on innovative projects." },
        { name: "Dewang Kanekar", role: "Bharati Vidyapeeth", quote: "Completed an Industrial Robotics Internship Program and am now an intern at PNT Robotics, working on robotic hands and trolley robots." },
        { name: "Ishanya", role: "Manipal Academy of Higher Education, Dubai Campus", quote: "I conducted filament color change tests, dynamic analysis, and researched braking mechanisms for high-RPM flywheels. Additionally, I assembled parts for an Autonomous Navigation machine, experimented with bearings, tested Arduino Nano modules, and used tools like angle grinders and drilling machines." },
    ];

    const testimonialsToShow = (liveTestimonials && liveTestimonials.length > 0) ? liveTestimonials : fallbackTestimonials;

    return (
        <div className="text-slate-900 dark:text-white">

            {/* ===== CREDIBILITY BADGE ===== */}
            <div className="py-8 mb-12 border-b border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center">Recognized & Backed By</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                            {/* Add your logos here matching these dimensions/aspect ratio */}
                            <div className="font-black text-xl text-slate-800 dark:text-slate-200">
                                Shark Tank India
                            </div>
                            <div className="flex items-center gap-2 font-black text-xl text-slate-800 dark:text-slate-200">
                                <Award className="w-6 h-6 text-blue-500" /> PM Modi Recognized
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== SECTION 2: PROBLEM STATEMENT ===== */}
            <section className="py-24 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                        <span className="inline-block bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold tracking-widest uppercase text-xs px-4 py-2 rounded-full mb-5 border border-red-200 dark:border-red-500/30">⚠ The Crisis</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">The Problem Statement</h2>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row gap-8 mb-12">
                        {/* India Problem Statement */}
                        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                            className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 rounded-3xl p-8 lg:w-1/2 shadow-lg">
                            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">🇮🇳 The Current Landscape</h3>
                            <ul className="space-y-5 text-slate-700 dark:text-slate-300 leading-relaxed">
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">1</div>
                                    <p>A study by NASSCOM reveals <span className="font-bold text-red-600 dark:text-red-400">only 10% of Indian engineering graduates</span> are employable in robotics-related fields.</p>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">2</div>
                                    <p>Theoretical-heavy curriculum fail to provide hands-on experience and industry-ready skills.</p>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">3</div>
                                    <p>India highly lags behind countries like China and Japan in the adoption of AMR, AGVs and robotic arms.</p>
                                </li>
                            </ul>
                        </motion.div>

                        {/* China comparison */}
                        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                            className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-500/20 rounded-3xl p-8 lg:w-1/2 shadow-lg">
                            <h3 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-6 flex items-center gap-2">🇨🇳 The Global Benchmark</h3>
                            <ul className="space-y-5 text-slate-700 dark:text-slate-300 leading-relaxed">
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-5 h-5" /></div>
                                    <p>China's "Made in China 2025" initiative heavily promotes industrial automation.</p>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-5 h-5" /></div>
                                    <p>Result: China produces 150,000+ robotics graduates annually, who seamlessly integrate into the workforce.</p>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-5 h-5" /></div>
                                    <p>Colleges partner with robotics manufacturers to offer students live project experience and internships.</p>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== SECTION 3: THE OPPORTUNITY — Animated Timeline ===== */}
            <section className="py-28 px-4 overflow-hidden relative">
                {/* Background decorative orbs */}
                <div className="absolute top-10 left-1/4 w-80 h-80 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto max-w-5xl relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-20">
                        <span className="inline-block bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase text-xs px-4 py-2 rounded-full mb-5 border border-blue-200 dark:border-blue-500/30">The Opportunity</span>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-300 dark:to-indigo-400 bg-clip-text text-transparent">A Transformative Vision</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">PNT Academy proposes a permanently deployed, industry-aligned Robotics &amp; Autonomous Systems Lab — designed to bridge curriculum gaps, enhance employability, and fuel innovation.</p>
                    </motion.div>

                    {/* Animated Roadmap Steps */}
                    <div className="relative">
                        {/* Vertical connecting line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-300 via-indigo-400 to-purple-400 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 -translate-x-1/2" />

                        <div className="space-y-10">
                            {[
                                { num: "01", icon: "🏭", title: "Permanent Industrial Robotics Lab Setup", desc: "Industry-grade robotics hardware installed on-campus permanently — not rented or borrowed.", color: "blue", bg: "from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/30", border: "border-blue-200 dark:border-blue-700/50", numBg: "bg-blue-600" },
                                { num: "02", icon: "📚", title: "Curriculum-Integrated Learning Model", desc: "Mapped to university syllabi so every lab session enriches the student's coursework.", color: "indigo", bg: "from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/30", border: "border-indigo-200 dark:border-indigo-700/50", numBg: "bg-indigo-600" },
                                { num: "03", icon: "👩‍🏫", title: "Faculty Enablement & Ownership", desc: "Faculty training, certification, and ongoing support so the lab thrives independently.", color: "violet", bg: "from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/30", border: "border-violet-200 dark:border-violet-700/50", numBg: "bg-violet-600" },
                                { num: "04", icon: "🎓", title: "Student Skill Development & Industry Exposure", desc: "Real internships, placement drives, and industry connect — bridging education to employment.", color: "purple", bg: "from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/30", border: "border-purple-200 dark:border-purple-700/50", numBg: "bg-purple-600" },
                                { num: "05", icon: "💡", title: "Innovation, Research & IIC Enablement", desc: "IEEE papers, patents, robotics competitions, and IIC-backed innovation projects.", color: "pink", bg: "from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/30", border: "border-pink-200 dark:border-pink-700/50", numBg: "bg-pink-600" },
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12, duration: 0.55, type: "spring", stiffness: 80 }}
                                    className={`flex items-center gap-6 md:gap-10 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    {/* Card */}
                                    <div className={`flex-1 bg-gradient-to-br ${step.bg} border ${step.border} rounded-2xl p-6 md:p-8 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                                        <div className="flex items-center gap-4 mb-3">
                                            <span className="text-3xl">{step.icon}</span>
                                            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-tight">{step.title}</h3>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                                    </div>
                                    {/* Step Number Bubble — center column */}
                                    <div className={`shrink-0 w-14 h-14 ${step.numBg} rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg z-10`}>
                                        {step.num}
                                    </div>
                                    {/* Spacer to balance the other side */}
                                    <div className="flex-1 hidden md:block" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* ===== SECTION 4: OUR SOLUTION — 3x2 Product Grid ===== */}
            <section className="py-24 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                        <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-4 block">Our Solution</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-4">Industry-Aligned Lab Equipment</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">That&apos;s where we come in — with an industry-aligned Robotics & Autonomous Systems Lab within the institution.</p>
                    </motion.div>

                    <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:px-0 snap-x snap-mandatory md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-5 md:overflow-visible md:pb-0 scrollbar-hide">
                        {PRODUCTS.map((p, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.5 }}
                                className="min-w-[72vw] md:min-w-0 snap-center shrink-0 mr-4 md:mr-0 last:mr-0 bg-white dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 text-center group hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center overflow-visible"
                                style={{ borderColor: 'transparent' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = p.accentColor + '55')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
                            >
                                {/* 3D Model viewer — uniform square, same size across all */}
                                <div className="w-full aspect-square max-h-[140px] mb-4 relative bg-transparent">
                                    {/* Glow dot */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-16 h-16 rounded-full blur-2xl opacity-40" style={{ background: p.accentColor }} />
                                    </div>
                                    <ProductMiniModel accentColor={p.accentColor} glbPath={p.glbPath} image={p.image} />
                                </div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 leading-tight">{p.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{p.specs}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* TRADITIONAL VS CUSTOMIZED COMPARISON */}
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mt-20">
                        <div className="text-center mb-10">
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">Why Choose Our Approach?</h3>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">A stark contrast between conventional textbook learning and our hands-on industrial ecosystem.</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {/* Traditional */}
                            <div className="bg-red-50/50 dark:bg-red-950/20 rounded-3xl p-8 border border-red-100 dark:border-red-900/30 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 dark:bg-red-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <span className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-500 text-xl font-bold">✕</span>
                                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Traditional Tech Labs</h4>
                                </div>
                                <ul className="space-y-4 relative z-10">
                                    {[
                                        "Closed source, black-box systems with limited customizability.",
                                        "Focus on obsolete technologies no longer used in modern factories.",
                                        "Rigid theoretical learning with restricted hands-on experimentation.",
                                        "No clear pathway or connection to immediate industry employment.",
                                        "Equipment quickly becomes outdated with no modular upgrade path."
                                    ].map((text, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                            <span className="mt-1 text-red-400 shrink-0">−</span>
                                            <span className="text-sm">{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Customized */}
                            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-3xl p-8 border border-emerald-200 dark:border-emerald-800/40 relative overflow-hidden shadow-lg shadow-emerald-500/5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl font-bold shadow-md">✓</span>
                                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">PNT Customized Solutions</h4>
                                </div>
                                <ul className="space-y-4 relative z-10">
                                    {[
                                        "Custom-integrated circuits and flexible platforms (ROS, Python, C++).",
                                        "Deployment of modern industrial-grade AGVs, AMRs, and 6-axis Arms.",
                                        "Project-based learning encouraging reverse-engineering and innovation.",
                                        "Direct placement assistance and pipeline to top robotics companies.",
                                        "Modular ecosystem—upgrade sensors and compute boards anytime."
                                    ].map((text, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 font-medium">
                                            <span className="mt-1 text-emerald-500 shrink-0">✓</span>
                                            <span className="text-sm">{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== SECTION 5: HOW IT WORKS ===== */}
            <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#0A0A0F] dark:to-[#111827]">
                <div className="container mx-auto max-w-4xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                        <span className="text-violet-400 font-bold tracking-widest uppercase text-sm mb-4 block">How It Works</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-4">Deploy Any Package At Your Institution</h2>
                    </motion.div>

                    <div className="space-y-6">
                        {[
                            { icon: "🕐", title: "Free 30-hour hands-on training", desc: "Comprehensive hands-on training for students and faculty included with every deployment." },
                            { icon: "🏗️", title: "Industrial Exposure", desc: "Real-world applications in logistics, smart warehouses, and supply chain automation." },
                            { icon: "🎖️", title: "Defense Internships", desc: "Internship opportunities on Indian Navy & Indian Army projects with PNT Robotics." },
                            { icon: "📜", title: "Letter of Recommendation", desc: "LOR provided to selected outstanding students." },
                            { icon: "🏆", title: "Robotics Competitions", desc: "Entry into national and international robotics competitions." },
                        ].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="flex items-start gap-6 bg-white dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 hover:border-violet-500/30 transition-all">
                                <span className="text-3xl shrink-0">{item.icon}</span>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SECTION 6: VALUE PROPOSITION ===== */}
            <section className="py-24 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                        <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4 block">Why PNT</span>
                        <h2 className="text-4xl md:text-5xl font-black">Value Proposition</h2>
                    </motion.div>

                    <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:px-0 snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:pb-0 scrollbar-hide">
                        {[
                            { icon: "🔧", title: "Modular Design", points: ["Add or replace microcontrollers/SBCs", "Integrate additional sensors, drivers, communication modules", "Increase degrees of freedom in robotic arms", "Redesign power distribution, control logic, and feedback loops"] },
                            { icon: "🖨️", title: "3D Printed & Customizable", points: ["Parts of robotic arm, AGV, or AMR are 3D printed", "CAD files and tutorials provided", "Students can experiment with different designs", "Encourages reverse engineering & system-level thinking"] },
                            { icon: "💻", title: "Customizable Architectures", points: ["Robotic Arm + AMR integration", "AGV + Robotic Hand coordination", "Custom hybrid robotic systems for research projects", "Full coding flexibility — no black-box controllers"] },
                            { icon: "🔋", title: "Fireproof Battery Systems", points: ["Industry-grade Fireproof LiFePO4 power cells", "Guaranteed safe continuous operation", "Integrated Battery Management System (BMS)", "Extended 6-hour rigorous testing lifespan"] },
                            { icon: "🔬", title: "Research & IIC Enablement", points: ["Encourages reverse engineering", "System-level thinking", "Innovation beyond predefined experiments", "IEEE / Scopus paper guidance"] },
                        ].map((pillar, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}
                                className="min-w-[85vw] md:min-w-0 snap-center shrink-0 mr-4 md:mr-0 last:mr-0 bg-white dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-all">
                                <span className="text-4xl block mb-4">{pillar.icon}</span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{pillar.title}</h3>
                                <ul className="space-y-2">
                                    {pillar.points.map((pt, j) => (
                                        <li key={j} className="flex items-start gap-2 text-slate-500 dark:text-slate-400 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />{pt}</li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ===== SECTIONS 8-13: PRODUCT DETAIL CARDS ===== */}
            <section className="py-24 px-4 overflow-visible">
                <div className="container mx-auto max-w-6xl space-y-28 overflow-visible">
                    {PRODUCTS.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7 }}
                            className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-14 items-center overflow-visible`}
                        >
                            {/* 3D Model Viewer — replaces the old image */}
                            <div
                                className="w-full md:w-1/2 aspect-[1/1] md:aspect-[4/3] relative bg-transparent overflow-visible"
                            >
                                {/* Subtle glow orb behind */}
                                <div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                                    style={{ background: p.accentColor, opacity: 0.12 }}
                                />
                                {/* Corner label */}
                                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                                    <span
                                        className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                                        style={{ background: `${p.accentColor}22`, color: p.accentColor, border: `1px solid ${p.accentColor}44` }}
                                    >
                                        3D Model
                                    </span>
                                </div>
                                {/* 3D Model — the inner canvas is expanded 50% in all directions; overflow must be visible all the way up */}
                                <div className="absolute inset-0 z-0 pointer-events-none overflow-visible">
                                    <ProductDetailModel3D accentColor={p.accentColor} glbPath={p.glbPath} image={p.image} />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="w-full md:w-1/2">
                                {/* Accent line */}
                                <div className="w-10 h-1 rounded-full mb-6 mx-auto md:mx-0" style={{ background: `linear-gradient(90deg, ${p.accentColor}, ${p.accentColor}44)` }} />
                                <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">{p.name}</h3>
                                <span
                                    className="inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4"
                                    style={{ background: `${p.accentColor}20`, color: p.accentColor }}
                                >
                                    {p.specs}
                                </span>
                                <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{p.tagline}</p>
                                {(p as any).extraSpecs && (
                                    <div className="bg-slate-50/80 dark:bg-slate-900/50 shadow-inner rounded-xl p-5 mb-5 border border-slate-200/60 dark:border-slate-800" style={{ borderLeft: `4px solid ${p.accentColor}` }}>
                                        <h4 className="font-bold text-slate-800 dark:text-white mb-3 text-sm">Technical Specifications</h4>
                                        <div className="space-y-2">
                                            {(p as any).extraSpecs.map((s: string, j: number) => (
                                                <p key={j} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                                                    <span className="mt-1 flex-shrink-0" style={{ color: p.accentColor }}>•</span>
                                                    <span>{s}</span>
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <ul className="space-y-2">
                                    {p.features.map((f, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: p.accentColor }} />{f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ===== SECTION 14: COLLEGE BENEFITS ===== */}
            <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#0A0A0F] dark:to-[#111827]">
                <div className="container mx-auto max-w-6xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                        <span className="text-blue-600 dark:text-cyan-400 font-bold tracking-widest uppercase text-sm mb-4 block">Key Advantages</span>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white">College Benefits</h2>
                    </motion.div>

                    <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:px-0 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 scrollbar-hide">
                        {[
                            { icon: "🎓", title: "Academic Benefits", points: ["Supports NEP 2020 experiential & skill-based learning", "Branch-aligned curriculum integration"] },
                            { icon: "💡", title: "Innovation & Entrepreneurship", points: ["Innovation challenges & hackathons", "Prototype development", "Student startups support"] },
                            { icon: "👩‍🏫", title: "Faculty Development", points: ["FDPs (paid/sponsored)", "Train-the-trainer certification", "Access to hardware schematics, software repositories, experiment manuals", "Joint mentoring model (PNT + faculty)"] },
                            { icon: "💼", title: "Revenue & Research", points: ["Certification programs for external students", "Industry workshops & bootcamps", "Sponsored final-year projects", "Capstone & minor project themes", "IEEE / Scopus paper guidance", "Prototype-to-patent pathway", "Support for innovation grants & competitions"] },
                        ].map((b, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="min-w-[80vw] md:min-w-0 snap-center shrink-0 mr-4 md:mr-0 last:mr-0 bg-white dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all">
                                <span className="text-5xl block mb-6">{b.icon}</span>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{b.title}</h3>
                                <ul className="space-y-3">
                                    {b.points.map((pt, j) => <li key={j} className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-start gap-2"><span className="text-blue-500 font-bold">✓</span>{pt}</li>)}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SECTION 15: BRANCH ALIGNMENT ===== */}
            <section id="branch-alignment" className="py-24 px-4 relative overflow-hidden bg-slate-50 dark:bg-[#0A0A0F]">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl rounded-full pointer-events-none"></div>
                <div className="container mx-auto max-w-6xl relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                        <span className="text-blue-600 dark:text-cyan-400 font-bold tracking-widest uppercase text-sm mb-4 block">Interdisciplinary Integration</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white">Branch Alignment & Curriculum</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">Our robotics lab bridges the gap between multiple engineering disciplines, fostering a truly collaborative and mechatronic learning environment.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[
                            { name: "Mechanical", icon: "⚙️", desc: "Kinematics, dynamics, and structural analysis of robotic arms and AGVs.", color: "from-orange-500 to-amber-500" },
                            { name: "Mechatronics", icon: "🤖", desc: "Synergy of mechanical structures with electronic control systems.", color: "from-blue-500 to-cyan-500" },
                            { name: "Electrical & E&TC", icon: "⚡", desc: "Power distribution, motor drives, and embedded communication.", color: "from-purple-500 to-indigo-500" },
                            { name: "Computer Science & IT", icon: "💻", desc: "Software architecture, ROS programming, and algorithmic path planning.", color: "from-emerald-500 to-teal-500" },
                            { name: "AI & Machine Learning", icon: "🧠", desc: "Computer vision, object detection, and autonomous decision making.", color: "from-pink-500 to-rose-500" },
                            { name: "Robotics Engineeering", icon: "🦾", desc: "Complete system integration, sensor fusion, and advanced autonomy.", color: "from-slate-600 to-slate-800" }
                        ].map((branch, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 overflow-hidden shadow-lg shadow-slate-200/50 dark:shadow-none">
                                {/* Hover Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${branch.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300`}></div>

                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br border border-white/20 shadow-inner flex items-center justify-center text-3xl mb-6 ${branch.color} text-white`}>
                                    {branch.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{branch.name}</h3>
                                <p className="text-base text-slate-600 dark:text-slate-400 transition-colors">{branch.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SECTION 16: TOP INDUSTRY ASSOCIATIONS & HIRING PARTNERS ===== */}
            <LabPartnersSection labPartners={labPartners} />

            {/* ===== SECTION 17: STUDENT TESTIMONIALS ===== */}
            <SectionCAlumni 
                testimonials={testimonialsToShow} 
                title="Student's Testimonials"
                subtitle="Hear from engineering students who have gained hands-on experience, secured internships, and accelerated their careers through our industrial automation labs."
            />

            {/* ===== SECTION 20: CONCLUSION CTA ===== */}
            <section className="py-32 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)]" />
                <div className="container mx-auto max-w-3xl relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <h2 className="text-4xl md:text-6xl font-black mb-6">Join the Automation Revolution</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-4">PNT Academy invites your institution to be a part of this transformative journey in automation education. Together, let us shape the future of education and innovation.</p>
                        <p className="text-slate-400 dark:text-slate-500 text-sm mb-10">Join hands with PNT Academy to revolutionize your institution&apos;s approach to learning and empower the next generation of automation leaders.</p>
                        <div className="flex justify-center mt-6">
                            <a href="/contact" className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(59,130,246,0.35)] hover:shadow-[0_6px_25px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all">
                                Contact Us Today
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>


        </div>
    );
}

// -------------------------------------------------------------
// Shared Lab Gallery Component
// -------------------------------------------------------------
function LabGallerySection() {
    const [images, setImages] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/admin/gallery")
            .then(r => r.json())
            .then((data: any[]) => {
                // Filter strictly to "Lab Setup" photos only
                const labPhotos = data.filter((item: any) => item.category === "Lab Setup");
                setImages(labPhotos);
            }).catch(console.error);
    }, []);

    if (!images || images.length === 0) return null;

    return (
        <section className="py-24 text-slate-900 dark:text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />

            {/* Heading — stays centered */}
            <div className="container mx-auto max-w-6xl px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-blue-600 dark:text-cyan-400 font-bold tracking-widest uppercase text-sm mb-4 block">Deployment Gallery</span>
                    <h2 className="text-4xl md:text-5xl font-black mb-4">Labs in Action</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">A glimpse into our state-of-the-art robotics & automation labs deployed across premier institutions.</p>
                </div>
            </div>

            {/* Full-width marquee strip — breaks out of container */}
            <div className="relative w-full overflow-hidden mt-4">
                {/* Left fade edge */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-slate-50/60 dark:from-slate-950/60 to-transparent" />
                {/* Right fade edge */}
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-slate-50/60 dark:from-slate-950/60 to-transparent" />

                <div
                    className="flex gap-6 px-6 w-max"
                    style={{ animation: 'labMarquee 40s linear infinite' }}
                >
                    {[...images, ...images, ...images].map((img, i) => (
                        <div
                            key={`${img._id || i}-${i}`}
                            className="relative w-[260px] h-[260px] md:w-[320px] md:h-[320px] flex-shrink-0 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl group/card cursor-pointer"
                        >
                            <Image
                                src={img.imageUrl}
                                alt={img.title || "Lab Photo"}
                                fill
                                className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                                sizes="(max-width: 768px) 260px, 320px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-center rounded-full">
                                <span className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider mb-1">{img.category}</span>
                                <h3 className="text-white font-semibold text-sm line-clamp-2">{img.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes labMarquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-33.333333%); }
                }
                .group:hover .w-max[style*="labMarquee"] {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
