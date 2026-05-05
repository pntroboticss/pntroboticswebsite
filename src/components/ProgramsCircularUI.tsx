"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html, Stars } from "@react-three/drei";
import * as THREE from "three";
import { ArrowRight, Bot, GraduationCap, School, Users } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

// Hook to detect mobile
function useIsMobile() {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    useEffect(() => {
        const check = () => setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return isMobile;
}

const PROGRAMS = [
    {
        id: "schools",
        title: "Training for Schools",
        icon: School,
        color: "from-blue-500 to-indigo-600",
        bg: "bg-gradient-to-br from-blue-500 to-indigo-600",
        shadow: "shadow-blue-500/30",
        border: "border-blue-200 dark:border-blue-800",
        description: "Equip your school with practical robotics labs and a comprehensive STEM curriculum that prepares students for the future of automation.",
        link: "/programs/schools",
        linkText: "Explore School Programs"
    },
    {
        id: "colleges",
        title: "Trainings for Colleges",
        icon: GraduationCap,
        color: "from-purple-500 to-pink-600",
        bg: "bg-gradient-to-br from-purple-500 to-pink-600",
        shadow: "shadow-purple-500/30",
        border: "border-purple-200 dark:border-purple-800",
        description: "Industry-aligned, project-based training for engineering and diploma students — bridging the gap between academics and real-world skills.",
        link: "/programs/colleges",
        linkText: "Explore College Trainings"
    },
    {
        id: "junior",
        title: "Courses for Kids",
        icon: Users,
        color: "from-orange-500 to-red-600",
        bg: "bg-gradient-to-br from-orange-500 to-red-600",
        shadow: "shadow-orange-500/30",
        border: "border-orange-200 dark:border-orange-800",
        description: "Ignite young minds (Grades 4–12) with hands-on robotics, AI, and coding projects designed to spark a lifelong love of technology.",
        link: "/programs/courses-for-kids",
        linkText: "Join the Courses"
    },
    {
        id: "lab",
        title: "Robotics Lab for Institutes",
        icon: Bot,
        color: "from-emerald-500 to-teal-600",
        bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
        shadow: "shadow-emerald-500/30",
        border: "border-emerald-200 dark:border-emerald-800",
        description: "Set up a state-of-the-art Composite Skill Lab in your institute with cutting-edge hardware, IoT kits, and full curriculum support.",
        link: "/schools/robotics-lab",
        linkText: "Build Your Lab"
    }
];

// Realistic Earth Component
function RealisticEarth() {
    const earthRef = useRef<THREE.Mesh>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);
    const [colorMap, bumpMap, cloudsMap] = useLoader(THREE.TextureLoader, [
        'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
        'https://unpkg.com/three-globe/example/img/earth-topology.png',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
    ]);
    useFrame((_, delta) => {
        if (earthRef.current) earthRef.current.rotation.y += delta * 0.05;
        if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.06;
    });
    return (
        <group>
            <mesh ref={earthRef} castShadow receiveShadow>
                <sphereGeometry args={[5, 32, 32]} />
                <meshStandardMaterial map={colorMap} bumpMap={bumpMap} bumpScale={0.05} roughness={0.6} metalness={0.1} />
            </mesh>
            <mesh ref={cloudsRef}>
                <sphereGeometry args={[5.65, 64, 64]} />
                <meshStandardMaterial map={cloudsMap} transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
            </mesh>
            <mesh>
                <sphereGeometry args={[5.8, 32, 32]} />
                <meshBasicMaterial color="#4b91ff" transparent opacity={0.15} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
            </mesh>
        </group>
    );
}

function RealisticMoon() {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const orbitRef = useRef<THREE.Group>(null);
    const moonRef = useRef<THREE.Mesh>(null);
    const starsRef = useRef<THREE.Group>(null);
    const [moonTexture] = useLoader(THREE.TextureLoader, ['https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg']);
    useFrame((_, delta) => {
        if (orbitRef.current) {
            const targetRotationY = isDark ? Math.PI : 0;
            orbitRef.current.rotation.y += (targetRotationY - orbitRef.current.rotation.y) * 0.05;
            const progress = Math.max(0, Math.min(1, orbitRef.current.rotation.y / Math.PI));
            const moonScale = Math.max(0, progress);
            if (moonRef.current) moonRef.current.scale.set(moonScale, moonScale, moonScale);
            if (starsRef.current) starsRef.current.scale.set(moonScale, moonScale, moonScale);
        }
        if (moonRef.current) moonRef.current.rotation.y += delta * 0.05;
    });
    return (
        <group ref={orbitRef}>
            <mesh ref={moonRef} position={[-4.5, 3.5, -4.5]}>
                <sphereGeometry args={[1.0, 64, 64]} />
                <meshStandardMaterial map={moonTexture} roughness={1} metalness={0} />
                <pointLight intensity={0.5} color="#cbd5e1" distance={30} />
            </mesh>
            <group ref={starsRef} position={[-4.5, 0, -4.5]}>
                <Stars radius={20} depth={20} count={1000} factor={3} saturation={0} fade speed={1} />
            </group>
        </group>
    );
}

function OrbitingSystem() {
    const groupRef = useRef<THREE.Group>(null);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [frontNode, setFrontNode] = useState<string | null>(null);
    const frontNodeRef = useRef<string | null>(null);
    const radius = 7.5;
    useFrame((_, delta) => {
        if (groupRef.current) {
            if (!hoveredNode) groupRef.current.rotation.y -= delta * 0.2;
            let maxZ = -Infinity;
            let currentFront = null;
            PROGRAMS.forEach((prog, index) => {
                const angle = (index / PROGRAMS.length) * Math.PI * 2;
                const globalZ = Math.sin(angle + groupRef.current!.rotation.y) * radius;
                if (globalZ > maxZ) { maxZ = globalZ; currentFront = prog.id; }
            });
            if (currentFront !== frontNodeRef.current) {
                frontNodeRef.current = currentFront;
                setFrontNode(currentFront);
            }
        }
    });
    return (
        <group ref={groupRef}>
            {PROGRAMS.map((prog, index) => {
                const angle = (index / PROGRAMS.length) * Math.PI * 2;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                const y = Math.sin(angle * 2) * 1.5;
                const isActive = hoveredNode ? hoveredNode === prog.id : frontNode === prog.id;
                const isFaded = hoveredNode ? !isActive : false;
                return (
                    <group key={prog.id} position={[x, y, z]}>
                        <Html center zIndexRange={[100, 0]} style={{ opacity: isFaded ? 0.3 : 1, filter: isFaded ? 'blur(4px)' : 'none', transition: 'all 0.4s ease', pointerEvents: isFaded ? 'none' : 'auto' }}>
                            <div className="relative group cursor-pointer" onPointerEnter={() => setHoveredNode(prog.id)} onPointerLeave={() => setHoveredNode(null)}>
                                <div className={`w-24 h-24 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl flex items-center justify-center transition-all duration-300 ${isActive ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                                    <prog.icon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[320px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200/50 dark:border-slate-700/50 transition-all duration-700 origin-center ${isActive ? `scale-100 opacity-100 rotate-y-0 ${prog.shadow}` : 'scale-75 opacity-0 rotate-y-90 pointer-events-none'}`} style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}>
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${prog.color} flex items-center justify-center mb-4 text-white shadow-lg`}>
                                        <prog.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{prog.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{prog.description}</p>
                                    <Link href={prog.link} className={`inline-flex items-center justify-center w-full gap-2 px-4 py-3 bg-gradient-to-r ${prog.color} text-white font-bold rounded-xl transition-transform hover:-translate-y-1 shadow-md`}>
                                        {prog.linkText} <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </Html>
                    </group>
                );
            })}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
                <meshBasicMaterial color={0x888888} transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
}

// Premium Mobile Card Grid — replaces 3D canvas on mobile
function MobileProgramCards() {
    const [activeId, setActiveId] = useState<string | null>(null);
    return (
        <div className="grid grid-cols-1 gap-4 px-2 py-4">
            {PROGRAMS.map((prog) => (
                <Link
                    key={prog.id}
                    href={prog.link}
                    className={`group relative rounded-2xl border ${prog.border} bg-white/80 dark:bg-slate-900/80 backdrop-blur p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
                >
                    {/* Color accent bar on left */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${prog.bg} rounded-l-2xl`} />
                    <div className="flex items-start gap-4 pl-3">
                        <div className={`w-12 h-12 rounded-xl ${prog.bg} flex items-center justify-center text-white shadow-lg shrink-0`}>
                            <prog.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{prog.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{prog.description}</p>
                            <span className={`inline-flex items-center gap-1 mt-3 text-xs font-bold bg-gradient-to-r ${prog.color} bg-clip-text text-transparent`}>
                                {prog.linkText} <ArrowRight className="w-3 h-3 text-current" />
                            </span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default function ProgramsCircularUI() {
    const isMobile = useIsMobile();

    // Wait until we know screen size to prevent flash
    if (isMobile === null) return <div className="h-64 w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />;

    // Mobile: premium card list — no 3D, no lag
    if (isMobile) {
        return (
            <div className="w-full mt-4 pb-8">
                <MobileProgramCards />
            </div>
        );
    }

    // Desktop: full 3D experience
    return (
        <div className="w-full h-[1000px] relative mt-16 overflow-visible transition-colors duration-500 mobile-safe-canvas">
            <Canvas camera={{ position: [0, 2, 22], fov: 45 }} frameloop="always" dpr={[1, 2]}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 20, 10]} intensity={2.5} color="#ffffff" />
                <directionalLight position={[-10, -10, -10]} intensity={1.5} color="#3b82f6" />
                <pointLight position={[0, -5, 5]} intensity={1.0} color="#0ea5e9" />
                <group position={[0, 1.5, 0]}>
                    <RealisticEarth />
                    <RealisticMoon />
                    <OrbitingSystem />
                </group>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />
            </Canvas>
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                <p className="text-sm font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2">
                    <span className="w-8 h-px bg-slate-300 dark:bg-slate-700" />
                    Drag to rotate &bull; Hover to expand
                    <span className="w-8 h-px bg-slate-300 dark:bg-slate-700" />
                </p>
            </div>
        </div>
    );
}
