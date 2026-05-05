"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF, useAnimations, Html } from "@react-three/drei";
import * as THREE from "three";
import { Terminal, Lightbulb, Minimize2, Cpu, Maximize2, X, Power, BatteryCharging, Wifi, Bot, Layers, Code2, Monitor, Gamepad2 } from "lucide-react";
import RoboMatchGame from "./RoboMatchGame";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

// ─── App registry — all real, no dummies ─────────────────────────────────────
const APPS = [
    {
        id: "python",
        label: "Python IDE",
        sublabel: "Online Python",
        icon: <Terminal className="w-6 h-6 text-white" />,
        gradient: "from-blue-500 to-indigo-600",
        // Trinket is the most mobile-friendly real Python web IDE
        url: "https://trinket.io/embed/python3?runOption=run&showInstructions=true",
    },
    {
        id: "arduino",
        label: "Arduino IDE",
        sublabel: "Wokwi Simulator",
        icon: <Cpu className="w-6 h-6 text-white" />,
        gradient: "from-teal-500 to-emerald-600",
        // Wokwi is the gold standard for Arduino simulation on webgl
        url: "https://wokwi.com/",
    },
    {
        id: "tinkercad",
        label: "Tinkercad",
        sublabel: "Autodesk",
        icon: <Lightbulb className="w-6 h-6 text-white" />,
        gradient: "from-amber-500 to-orange-600",
        // Tinkercad's dashboard — user must log in; we link to the landing for discoverability
        url: "https://www.tinkercad.com/",
        external: true,
    },
    {
        id: "scratch",
        label: "Scratch",
        sublabel: "MIT Block Coding",
        icon: <Layers className="w-6 h-6 text-white" />,
        gradient: "from-yellow-400 to-orange-500",
        url: "https://scratch.mit.edu/projects/editor/",
        external: true,
    },
    {
        id: "code",
        label: "Code.org",
        sublabel: "Learn to Code",
        icon: <Code2 className="w-6 h-6 text-white" />,
        gradient: "from-rose-500 to-pink-600",
        url: "https://studio.code.org/projects/applab/new",
        external: true,
    },
    {
        id: "simulator",
        label: "Circuit Lab",
        sublabel: "falstad.com",
        icon: <Monitor className="w-6 h-6 text-white" />,
        gradient: "from-violet-500 to-purple-600",
        // Falstad is the best real-time circuit simulator that embeds cleanly
        url: "https://falstad.com/circuit/circuitjs.html",
    },
    {
        id: "game",
        label: "Robo Match",
        sublabel: "Win a Prize",
        icon: <Gamepad2 className="w-6 h-6 text-white" />,
        gradient: "from-fuchsia-500 to-rose-600",
        url: "internal:game",
    },
];

type AppId = typeof APPS[number]["id"];

// ─── Full-Screen OS Component ─────────────────────────────────────────────────
function DesktopOS({ onShutDown }: { onShutDown: () => void }) {
    const [activeApp, setActiveApp] = useState<AppId | null>(null);
    const [isMaximized, setIsMaximized] = useState(false);
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    const [battery, setBattery] = useState<number | null>(null);
    const [isCharging, setIsCharging] = useState(false);
    const [isOnline, setIsOnline] = useState(true);

    // ── Real system data ──
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })), 1000);
        if ("getBattery" in navigator) {
            (navigator as any).getBattery().then((bat: any) => {
                setBattery(Math.round(bat.level * 100));
                setIsCharging(bat.charging);
                bat.addEventListener("levelchange", () => setBattery(Math.round(bat.level * 100)));
                bat.addEventListener("chargingchange", () => setIsCharging(bat.charging));
            });
        }
        setIsOnline(navigator.onLine);
        const up = () => setIsOnline(true);
        const dn = () => setIsOnline(false);
        window.addEventListener("online", up);
        window.addEventListener("offline", dn);
        return () => { clearInterval(timer); window.removeEventListener("online", up); window.removeEventListener("offline", dn); };
    }, []);

    const activeAppData = APPS.find(a => a.id === activeApp);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="fixed inset-0 z-[1000] w-screen h-screen overflow-hidden font-sans select-none flex flex-col"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }}
        >
            {/* ── Top Menu Bar ── */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 bg-black/50 backdrop-blur-xl text-white text-[11px] sm:text-xs z-50 shrink-0 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <span className="font-black text-sm">🍎 PNT OS</span>
                    {/* Hide menu items on very small screens */}
                    <span className="hidden sm:inline text-white/50">|</span>
                    {activeAppData && <span className="hidden sm:inline font-semibold">{activeAppData.label}</span>}
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`flex items-center gap-1 ${isOnline ? "text-white/70" : "text-red-400"}`}>
                        <Wifi className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">{isOnline ? "Online" : "Offline"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BatteryCharging className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isCharging ? "text-green-400" : "text-white/70"}`} />
                        {battery !== null && <span className="text-[10px]">{battery}%</span>}
                    </div>
                    <span className="font-medium text-[11px]">{time}</span>
                    <button
                        onClick={onShutDown}
                        className="ml-1 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors"
                        title="Close OS"
                    >
                        <X className="w-3.5 h-3.5 text-white" />
                    </button>
                </div>
            </div>

            {/* ── Desktop / App Area ── */}
            <div className="flex-1 relative overflow-hidden">
                {/* App grid when no app is open */}
                <AnimatePresence mode="wait">
                    {!activeApp && (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-8 md:hidden"
                        >
                            <p className="text-white/40 text-xs uppercase tracking-widest mb-6 font-bold">Tap an app to launch</p>
                            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 max-w-2xl w-full">
                                {APPS.map((app) => (
                                    <button
                                        key={app.id}
                                        onClick={() => setActiveApp(app.id as AppId)}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${app.gradient} shadow-2xl border border-white/20 flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-transform`}>
                                            {app.icon}
                                        </div>
                                        <span className="text-white text-[10px] sm:text-xs font-semibold drop-shadow bg-black/30 px-2 py-0.5 rounded text-center leading-tight">{app.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* App window */}
                    {activeApp && activeAppData && (
                        <motion.div
                            key={activeApp}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                            className={`absolute bg-slate-900/98 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden ${
                                isMaximized
                                    ? "inset-0 rounded-none"
                                    : "top-2 sm:top-6 left-2 sm:left-[5%] right-2 sm:right-[5%] bottom-20 sm:bottom-6 rounded-xl"
                            }`}
                        >
                            {/* Window chrome */}
                            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-white/10 shrink-0 bg-slate-900">
                                <div className="flex items-center gap-1.5">
                                    <button onClick={() => setActiveApp(null)} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors" title="Close" />
                                    <button className="w-3 h-3 rounded-full bg-yellow-500" title="Minimize (not available)" />
                                    <button onClick={() => setIsMaximized(!isMaximized)} className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors" title="Maximize" />
                                </div>
                                <span className="text-white/60 text-xs font-semibold">{activeAppData.label} — {activeAppData.sublabel}</span>
                                <button onClick={() => setIsMaximized(!isMaximized)} className="text-white/30 hover:text-white/70 transition-colors" title="Toggle Maximize">
                                    {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                                </button>
                            </div>

                            {/* App Content */}
                            <div className="flex-1 bg-white relative overflow-y-auto">
                                {activeAppData.id === "game" ? (
                                    <RoboMatchGame />
                                ) : (activeAppData as any).external ? (
                                    <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
                                        <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br ${activeAppData.gradient} shadow-2xl border border-white/20 flex items-center justify-center mb-6`}>
                                            <div className="scale-[1.5] sm:scale-[2]">
                                                {activeAppData.icon}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">{activeAppData.label}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm text-sm sm:text-base">
                                            For security and the best experience, {activeAppData.label} requires a full browser window to run.
                                        </p>
                                        <button
                                            onClick={() => window.open(activeAppData.url, "_blank")}
                                            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
                                        >
                                            Launch Application
                                        </button>
                                    </div>
                                ) : (
                                    <iframe
                                        src={activeAppData.url}
                                        title={activeAppData.label}
                                        className="w-full h-full border-none absolute inset-0"
                                        allow="accelerometer; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi;"
                                        sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                                    />
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Dock (Both Mobile and PC) ── */}
            <div className="relative z-50 flex items-end justify-center pb-3 pt-2 bg-gradient-to-t from-black/60 to-transparent shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl overflow-x-auto max-w-[95vw] sm:max-w-full">
                    {APPS.map((app) => (
                        <button
                            key={app.id}
                            onClick={() => setActiveApp(app.id as AppId)}
                            className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-b ${app.gradient} flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-lg relative ${activeApp === app.id ? "ring-2 ring-white scale-110" : ""}`}
                            title={app.label}
                        >
                            <div className="scale-90 sm:scale-100">{app.icon}</div>
                            {activeApp === app.id && <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full" />}
                        </button>
                    ))}
                    <div className="w-px h-8 bg-white/20 mx-0.5 sm:mx-1 shrink-0" />
                    <button
                        onClick={onShutDown}
                        className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-b from-red-400 to-red-600 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-lg"
                        title="Close PNT OS"
                    >
                        <Power className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// Preload the Robot model so it renders instantly
useGLTF.preload("/models/RobotExpressive.glb");

// ─── 3D Robot Model ───────────────────────────────────────────────────────────
function RobotModel({ onClick, osActive }: { onClick: () => void; osActive: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF("/models/RobotExpressive.glb") as any;
    const { mixer, actions } = useAnimations(animations, groupRef);
    const [hovered, setHovered] = useState(false);
    const prevAnim = useRef<string | null>(null);
    const { pointer } = useThree();

    const [idleAnim, setIdleAnim] = useState("Idle");

    // Cycle through varied animations every 8 seconds
    useEffect(() => {
        if (hovered || osActive) return;
        const interval = setInterval(() => {
            const nextAnims = ["Idle", "Yes", "ThumbsUp", "Dance"];
            const next = nextAnims[Math.floor(Math.random() * nextAnims.length)];
            setIdleAnim(next);
            // Revert back to Idle after the animation plays (roughly 3s)
            setTimeout(() => setIdleAnim("Idle"), 3000);
        }, 8000);
        return () => clearInterval(interval);
    }, [hovered, osActive]);

    useFrame((state, delta) => {
        mixer.update(delta);
    });

    useEffect(() => {
        if (!actions) return;
        
        // Slow down the robot by 40% for smoother premium animations
        mixer.timeScale = 0.6;

        // Hard stop all animations to kill any stuck loops (like Jump)
        mixer.stopAllAction();
        
        const animName = osActive ? "Idle" : (hovered ? "Wave" : idleAnim);
        
        if (actions[animName]) {
            actions[animName].reset().fadeIn(0.4).play();
            prevAnim.current = animName;
        } else if (Object.keys(actions).length > 0) {
            // Fallback
            actions[Object.keys(actions)[0]]?.reset().play();
        }
    }, [actions, hovered, mixer, osActive, idleAnim]);

    useFrame(() => {
        if (groupRef.current) {
            const targetRotationY = (pointer.x * Math.PI) / 6;
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
        }

        if (groupRef.current && !groupRef.current.userData.centered) {
            groupRef.current.scale.setScalar(1);
            groupRef.current.position.set(0, 0, 0);
            groupRef.current.updateMatrixWorld(true);

            const box = new THREE.Box3().setFromObject(groupRef.current);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            // Scale so full body fits (head to feet)
            const scaleFact = 1.9 / maxDim;

            groupRef.current.scale.setScalar(scaleFact);
            groupRef.current.position.x = -center.x * scaleFact;
            groupRef.current.position.y = -center.y * scaleFact - 0.4;
            groupRef.current.position.z = -center.z * scaleFact;
            groupRef.current.userData.centered = true;
        }
    });

    return (
        <group
            onClick={(e) => {
                e.stopPropagation();
                if (actions && actions["Jump"]) {
                    mixer.stopAllAction();
                    actions["Jump"]?.reset().play();
                }
                setTimeout(() => onClick(), 600);
            }}
            onPointerOver={() => { document.body.style.cursor = "pointer"; setHovered(true); }}
            onPointerOut={() => { document.body.style.cursor = "auto"; setHovered(false); }}
        >
            {/* Invisible large click sphere to expand hit area */}
            <mesh visible={false}>
                <sphereGeometry args={[2.5, 8, 8]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
            <group ref={groupRef}>
                <primitive object={scene} />
                
                {/* Discoverability Badge */}
                {!osActive && (
                    <Html position={[0, 4.5, 0]} center>
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.5 }}
                            animate={{ 
                                opacity: hovered ? 0 : 1, 
                                y: hovered ? 20 : [0, -12, 0],
                                scale: hovered ? 0.8 : [1, 1.05, 1]
                            }}
                            transition={{ 
                                opacity: { duration: 0.2 },
                                y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className={`whitespace-nowrap flex flex-col items-center pointer-events-none transition-all duration-300 ${hovered ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}
                        >
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base md:text-lg font-black px-6 py-3 rounded-2xl shadow-[0_4px_30px_rgba(37,99,235,0.6)] border-2 border-white/40 flex items-center gap-3 ring-4 ring-blue-500/20">
                                <span className="text-2xl animate-bounce">🎮</span> 
                                Click on me to play game!
                            </div>
                            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-blue-600 -mt-[1px]" />
                        </motion.div>
                    </Html>
                )}
            </group>
        </group>
    );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function InteractiveTerminal() {
    const [mounted, setMounted] = useState(false);
    const [webglFailed, setWebglFailed] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [osActive, setOsActive] = useState(false);
    const [eyelidsOpen, setEyelidsOpen] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleRobotClick = () => {
        if (!osActive && !isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
                setOsActive(true);
                setTimeout(() => setEyelidsOpen(true), 100);
            }, 700);
        }
    };

    const handleShutDown = () => {
        setEyelidsOpen(false);
        setTimeout(() => {
            setOsActive(false);
            setIsTransitioning(false);
        }, 800);
    };

    if (!mounted) return (
        <div className="w-full h-full flex flex-col space-y-4 items-center justify-center animate-pulse bg-slate-100 dark:bg-slate-800/50 rounded-[3rem]">
            <Cpu className="w-8 h-8 text-slate-400" />
            <span className="text-slate-500 font-mono text-sm uppercase tracking-widest">Loading...</span>
        </div>
    );

    const GracefulFallback = () => (
        <div
            onClick={handleRobotClick}
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 border border-slate-700/50 shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/30 transition-all duration-500 group"
        >
            <div className="relative mb-4">
                <Bot className="w-16 h-16 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                <div className="absolute inset-0 blur-xl bg-indigo-500/20 group-hover:bg-indigo-400/30 transition-all" />
            </div>
            <span className="text-slate-300 font-bold text-lg group-hover:text-white transition-colors">PNT OS</span>
            <span className="text-slate-500 text-sm mt-1 group-hover:text-slate-400 transition-colors">Tap to Launch</span>
        </div>
    );

    return (
        <>
            {createPortal(
                <>
                    <AnimatePresence>
                        {osActive && <DesktopOS onShutDown={handleShutDown} />}
                    </AnimatePresence>

                    {/* Cinematic FPV eyelid transition */}
                    <AnimatePresence>
                        {isTransitioning && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="fixed inset-0 z-[900] pointer-events-none flex flex-col"
                            >
                                <motion.div
                                    className="w-full bg-black/95 origin-top shadow-[0_20px_40px_rgba(0,0,0,1)]"
                                    initial={{ height: "50%" }}
                                    animate={{ height: eyelidsOpen ? "0%" : "50%" }}
                                    transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: eyelidsOpen ? 0.2 : 0 }}
                                />
                                <motion.div
                                    className="w-full bg-black/95 origin-bottom shadow-[0_-20px_40px_rgba(0,0,0,1)]"
                                    initial={{ height: "50%" }}
                                    animate={{ height: eyelidsOpen ? "0%" : "50%" }}
                                    transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: eyelidsOpen ? 0.2 : 0 }}
                                />
                                {!eyelidsOpen && (
                                    <motion.div
                                        className="absolute inset-0 bg-black"
                                        animate={{ opacity: [1, 0.9, 1, 0.8, 1] }}
                                        transition={{ duration: 0.4, repeat: Infinity, repeatType: "mirror" }}
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>,
                document.body
            )}

            {/* 3D Robot Canvas / Mobile Fallback */}
            <div className="w-full h-full relative">
                {/* Mobile Button */}
                <div className="lg:hidden absolute inset-0 sm:p-8 flex items-center justify-center">
                    <GracefulFallback />
                </div>
                
                {/* Desktop 3D Canvas */}
                <div className="hidden lg:block w-full h-full">
                    {webglFailed ? (
                        <GracefulFallback />
                    ) : (
                        <Canvas
                            camera={{ position: [0, 0, 5], fov: 45 }}
                            dpr={[1, 1.5]}
                            frameloop="always"
                            className={osActive || isTransitioning ? "opacity-0 pointer-events-none transition-opacity duration-300" : "opacity-100 transition-opacity duration-1000"}
                            onCreated={(state) => {
                                state.gl.domElement.addEventListener("webglcontextlost", (e) => {
                                    e.preventDefault();
                                    setWebglFailed(true);
                                });
                            }}
                        >
                            <Suspense fallback={<Html center><div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" /></Html>}>
                                <ambientLight intensity={0.7} />
                                <directionalLight position={[10, 10, 5]} intensity={1.5} color="#4338ca" />
                                <directionalLight position={[-10, 10, -5]} intensity={1.5} color="#3b82f6" />
                                <spotLight position={[0, 15, 0]} angle={0.8} penumbra={1} intensity={2} color="#ffffff" />
                                <RobotModel onClick={handleRobotClick} osActive={osActive} />
                                <Environment preset="city" />
                            </Suspense>
                        </Canvas>
                    )}
                </div>
            </div>
        </>
    );
}
