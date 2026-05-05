"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { Code2, CircuitBoard, Lightbulb, Video, PenTool, Zap, ChevronLeft, ChevronRight } from "lucide-react";

const PROJECTS = [
    { id: "p1", title: "Theft Detection", level: "Basic", icon: "🔒", objective: "Detect unauthorized access using IR sensors.", components: "IR Sensor, Arduino, Buzzer, LED, Resistors, Breadboard, Jumper Wires", steps: ["Study the working of IR sensor.", "Assemble the circuit on a breadboard.", "Interface the sensor and buzzer with Arduino.", "Design an enclosure for valuables.", "Test real-time theft detection."] },
    { id: "p2", title: "Traffic Signal", level: "Basic", icon: "🚦", objective: "Simulate a traffic signal using LEDs and Arduino.", components: "Red, Yellow, Green LEDs, Resistors, Arduino, Jumper Wires", steps: ["Understand LED and resistor functionality.", "Create a one-way traffic control circuit.", "Program LEDs in traffic light sequence.", "Test timing cycles to simulate real traffic."] },
    { id: "p3", title: "Smart Traffic Light", level: "Basic", icon: "🚗", objective: "Automate traffic control using Arduino and IR sensors.", components: "LEDs, IR Sensors, Arduino, Breadboard", steps: ["Learn basic Arduino programming.", "Interface IR sensors for vehicle detection.", "Program smart signal logic.", "Integrate hardware and software."] },
    { id: "p4", title: "Smart Street Light", level: "Basic", icon: "💡", objective: "Auto-control street lights using an LDR photoresistor.", components: "LDR Sensor, LEDs, Arduino, Resistors", steps: ["Explain LDR sensor operation.", "Assemble the circuit.", "Create a street light model.", "Deploy for real-time testing."] },
    { id: "p5", title: "Car Reverse Parking", level: "Basic", icon: "🅿️", objective: "Detect obstacles for safe reverse parking.", components: "Ultrasonic Sensor, Arduino, Buzzer, LEDs", steps: ["Introduction to ultrasonic sensor.", "Interface sensor with Arduino.", "Program distance alert via buzzer.", "Assemble rear-mounted model."] },
    { id: "p6", title: "Obstacle Avoiding Robot", level: "Basic", icon: "🤖", objective: "Build a robot that autonomously avoids obstacles.", components: "Ultrasonic Sensor, Motor Driver, DC Motors, Arduino, Robot Chassis", steps: ["Explain ultrasonic sensor working.", "Assemble motor driver & sensor circuit.", "Interface motors with Arduino.", "Test and calibrate movement."] },
    { id: "p7", title: "Line Follower Robot", level: "Basic", icon: "〰️", objective: "Develop a robot that follows a path using IR sensors.", components: "IR Sensors, Motor Driver, DC Motors, Arduino, Robot Chassis", steps: ["Learn IR sensor interfacing.", "Assemble circuit connections.", "Write path-following code.", "Test along black/white path."] },
    { id: "p8", title: "Radar System", level: "Basic", icon: "📡", objective: "Simulate radar detection with ultrasonic + servo.", components: "Ultrasonic Sensor, Servo Motor, Arduino", steps: ["Interface ultrasonic sensor with Arduino.", "Program servo to rotate for area scan.", "Visualise detected objects.", "Create radar assembly."] },
    { id: "p9", title: "Light Follower Robot", level: "Advanced", icon: "☀️", objective: "Build a robot that chases a light source.", components: "LDR Sensors, Motor Driver, DC Motors, Arduino", steps: ["Learn L293D driver working.", "Interface motor driver, motors & sensors.", "Program light-seeking logic.", "Assemble and test chassis."] },
    { id: "p10", title: "Smart Door Lock", level: "Advanced", icon: "🔑", objective: "Automate door access using RFID technology.", components: "RFID Sensor, Servo Motor, Arduino, Breadboard", steps: ["Introduction to RFID technology.", "Interface RFID with Arduino.", "Program unlock using authorised tag.", "Assemble complete door lock."] },
    { id: "p11", title: "Smart Dustbin", level: "Advanced", icon: "🗑️", objective: "Auto-open dustbin lid when someone approaches.", components: "Ultrasonic Sensor, Servo Motor, Arduino", steps: ["Learn servo motor working.", "Integrate ultrasonic sensor.", "Program lid-open logic.", "Test with real movement."] },
    { id: "p12", title: "Smart Stick", level: "Advanced", icon: "🦯", objective: "Help visually impaired people detect obstacles.", components: "Ultrasonic Sensor, Buzzer, Arduino, Battery", steps: ["Sensor interfacing.", "Program distance-based alerts.", "Assemble into a handheld stick.", "Real-time demonstration."] },
    { id: "p13", title: "Smart Irrigation", level: "Advanced", icon: "🌱", objective: "Automate plant watering with soil moisture sensing.", components: "Soil Moisture Sensor, Water Pump, Arduino", steps: ["Interface soil sensor with Arduino.", "Activate pump when soil is dry.", "Test with real plant setup.", "Optimise for automatic control."] },
    { id: "p14", title: "Medical Robot", level: "Advanced", icon: "🏥", objective: "Assist in medicine delivery in hospital settings.", components: "Ultrasonic Sensors, Motor Driver, DC Motors, Arduino", steps: ["Design base robot platform.", "Program for obstacle avoidance.", "Add medicine tray system.", "Demonstrate operation."] },
    { id: "p15", title: "IoT Home Automation", level: "Advanced", icon: "🏠", objective: "Control home appliances via smartphone or internet.", components: "NodeMCU, Relays, Bulbs/Fans, Blynk App or MQTT", steps: ["Setup NodeMCU with Wi-Fi.", "Program ON/OFF control via app.", "Interface electrical components safely.", "Test from smartphone."] },
];

const GRADIENTS = [
    ["#7C4DFF", "#00E5FF"], ["#00E5FF", "#00FFA3"], ["#FF6E84", "#7C4DFF"],
    ["#FFB347", "#FF6E84"], ["#00FFA3", "#00E5FF"], ["#7C4DFF", "#FF6E84"],
    ["#00E5FF", "#7C4DFF"], ["#00FFA3", "#FFB347"],
];

// Number of side cards visible on each side in the fan
const VISIBLE_SIDE = 2;

export default function RoboticsCurriculum() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [dragging, setDragging] = useState(false);
    const dragX = useMotionValue(0);
    const dragStartRef = useRef(0);

    const total = PROJECTS.length;
    const activeProject = PROJECTS[activeIndex];

    const prev = useCallback(() => setActiveIndex((i) => (i - 1 + total) % total), [total]);
    const next = useCallback(() => setActiveIndex((i) => (i + 1) % total), [total]);

    // Relative index from center: -2 -1 0 1 2 ...
    const relIdx = (idx: number) => {
        let rel = idx - activeIndex;
        if (rel > total / 2) rel -= total;
        if (rel < -total / 2) rel += total;
        return rel;
    };

    const handleDragStart = () => {
        dragStartRef.current = dragX.get();
        setDragging(true);
    };

    const handleDragEnd = (_: any, info: any) => {
        setDragging(false);
        const THRESHOLD = 60;
        if (info.offset.x < -THRESHOLD) next();
        else if (info.offset.x > THRESHOLD) prev();
        animate(dragX, 0, { type: "spring", stiffness: 400, damping: 40 });
    };

    const getCardStyle = (idx: number) => {
        const rel = relIdx(idx);
        const absRel = Math.abs(rel);

        if (absRel > VISIBLE_SIDE + 1) return null; // Don't render far cards

        const sign = rel === 0 ? 0 : rel / absRel || 0;

        // Fan-spread offsets
        const x = rel * 160 + dragX.get() * 0.35;
        const rotateY = rel * 22;       // degrees - fan out
        const scale = 1 - absRel * 0.12;
        const z = -absRel * 80;         // depth recession
        const opacity = 1 - absRel * 0.28;
        const zIndex = VISIBLE_SIDE + 2 - absRel;
        const brightness = 1 - absRel * 0.25;

        return { x, rotateY, scale, z, opacity, zIndex, brightness };
    };

    const [grad0, grad1] = GRADIENTS[activeIndex % GRADIENTS.length];

    return (
        <div className="max-w-7xl mx-auto mt-20 md:mt-32 px-4">
            {/* ── Header ── */}
            <div className="text-center mb-14">
                <motion.span
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="inline-block px-4 py-1.5 rounded-full border border-violet-400/40 text-[11px] uppercase tracking-widest font-black text-violet-500 dark:text-violet-400 mb-4 bg-violet-500/10"
                >
                    Interactive Syllabus
                </motion.span>
                <motion.h3
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight"
                >
                    The Project <span className="bg-gradient-to-r from-violet-500 via-cyan-400 to-teal-400 bg-clip-text text-transparent">Vault</span>
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
                    className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto"
                >
                    Swipe or tap the arrows to explore all 15 real-world builds. Tap a card to unlock its full mission brief.
                </motion.p>
            </div>

            {/* ── 3D Fan Carousel ── */}
            <div className="relative flex justify-center items-center" style={{ height: 320, perspective: "1000px" }}>
                {/* Arrow Controls */}
                <button
                    onClick={prev}
                    className="absolute left-0 md:-left-6 z-50 w-11 h-11 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-white hover:scale-110 transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={next}
                    className="absolute right-0 md:-right-6 z-50 w-11 h-11 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-white hover:scale-110 transition-all"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Drag capture layer */}
                <motion.div
                    className="absolute inset-0 z-40 cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.1}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    style={{ x: dragX }}
                />

                {/* Cards */}
                {PROJECTS.map((project, idx) => {
                    const style = getCardStyle(idx);
                    if (!style) return null;
                    const isActive = idx === activeIndex;
                    const [c0, c1] = GRADIENTS[idx % GRADIENTS.length];
                    const isBasic = project.level === "Basic";

                    return (
                        <motion.div
                            key={project.id}
                            className="absolute select-none"
                            style={{ zIndex: style.zIndex, filter: `brightness(${style.brightness})` }}
                            animate={{
                                x: style.x,
                                rotateY: style.rotateY,
                                scale: style.scale,
                                z: style.z,
                                opacity: style.opacity,
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 35 }}
                            onClick={() => {
                                if (!dragging) {
                                    if (isActive) return;
                                    const rel = relIdx(idx);
                                    if (rel > 0) next();
                                    else prev();
                                }
                            }}
                        >
                            {/* Card Shell */}
                            <div
                                className={`relative w-[220px] h-[260px] rounded-3xl overflow-hidden border backdrop-blur-2xl cursor-pointer transition-shadow duration-300 ${
                                    isActive
                                        ? "border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                                        : "border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                                }`}
                                style={{ background: isActive ? `linear-gradient(145deg, ${c0}28, ${c1}18)` : "rgba(255,255,255,0.05)" }}
                            >
                                {/* Iridescent gradient fill */}
                                <div
                                    className="absolute inset-0 opacity-70"
                                    style={{ background: `linear-gradient(145deg, ${c0}22, ${c1}15, transparent)` }}
                                />

                                {/* Glossy top sheen */}
                                <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-3xl"
                                    style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)" }}
                                />

                                {/* Glowing edge */}
                                {isActive && (
                                    <div
                                        className="absolute inset-0 rounded-3xl pointer-events-none"
                                        style={{ boxShadow: `inset 0 0 0 1.5px ${c0}60, 0 0 40px ${c0}30` }}
                                    />
                                )}

                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center gap-4">
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/20"
                                        style={{ background: `linear-gradient(135deg, ${c0}33, ${c1}22)` }}
                                    >
                                        {project.icon}
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: isBasic ? "#38bdf8" : "#a78bfa" }}>
                                            {project.level} · #{idx + 1}
                                        </div>
                                        <h4 className="font-black text-base leading-tight text-white drop-shadow-sm">
                                            {project.title}
                                        </h4>
                                        {isActive && (
                                            <motion.p
                                                initial={{ opacity: 0, y: 4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.15 }}
                                                className="text-xs text-white/60 mt-2 leading-relaxed line-clamp-2"
                                            >
                                                {project.objective}
                                            </motion.p>
                                        )}
                                    </div>

                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="absolute bottom-5 text-[10px] font-bold uppercase tracking-widest text-white/40"
                                        >
                                            ↓ Details below
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-1.5 mt-8 mb-14">
                {PROJECTS.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{
                            width: idx === activeIndex ? 28 : 6,
                            background: idx === activeIndex
                                ? `linear-gradient(90deg, ${grad0}, ${grad1})`
                                : "rgba(148,163,184,0.4)"
                        }}
                    />
                ))}
            </div>

            {/* ── Dynamic Detail Panel ── */}
            <div className="relative rounded-3xl overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl bg-white/30 dark:bg-slate-900/50 min-h-[400px]">
                {/* Top gradient shimmer */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${grad0}80, transparent)` }} />

                {/* Accent blob */}
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${grad0}, ${grad1})` }}
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeProject.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.26, ease: "easeOut" }}
                        className="relative z-10 p-8 md:p-12"
                    >
                        {/* Title */}
                        <div className="flex flex-col md:flex-row md:items-start gap-4 mb-10 pb-8 border-b border-white/20 dark:border-white/10">
                            <div className="flex items-center gap-4 flex-1">
                                <span className="text-5xl">{activeProject.icon}</span>
                                <div>
                                    <div className="text-xs font-black uppercase tracking-widest mb-1"
                                        style={{ color: activeProject.level === "Basic" ? "#38bdf8" : "#a78bfa" }}>
                                        {activeProject.level} Module · Project {activeIndex + 1} / {PROJECTS.length}
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                                        {activeProject.title}
                                    </h3>
                                </div>
                            </div>
                            <span className="shrink-0 self-start flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold backdrop-blur border border-white/20"
                                style={{ color: grad0, background: `${grad0}15` }}>
                                <Zap className="w-3.5 h-3.5" /> {activeProject.level}
                            </span>
                        </div>

                        {/* Grid */}
                        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
                            <div className="lg:col-span-1 lg:border-r border-white/20 dark:border-white/10 lg:pr-12">
                                <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-amber-400" /> Objective
                                </h5>
                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-8">{activeProject.objective}</p>

                                <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <CircuitBoard className="w-4 h-4 text-teal-400" /> Components
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {activeProject.components.split(", ").map((comp, i) => (
                                        <span key={i} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border backdrop-blur bg-white/30 dark:bg-white/5 border-white/30 dark:border-white/10 text-slate-700 dark:text-slate-300">
                                            {comp}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <Code2 className="w-4 h-4 text-blue-400" /> Step-by-Step Build
                                </h5>
                                <div className="space-y-5">
                                    {activeProject.steps.map((step, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.07 }}
                                            className="flex items-start gap-4"
                                        >
                                            <div
                                                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border backdrop-blur"
                                                style={{ background: `${grad0}22`, borderColor: `${grad0}40`, color: grad0 }}
                                            >
                                                {i + 1}
                                            </div>
                                            <p className="text-slate-700 dark:text-slate-300 text-sm pt-0.5 leading-relaxed">{step}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Perks ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-4 mt-12 max-w-4xl mx-auto"
            >
                {[
                    { icon: <PenTool className="w-5 h-5" />, color: "#00FFA3", title: "Custom 3D Printed Parts", body: "Advanced students receive custom 3D printed components for structural builds." },
                    { icon: <Video className="w-5 h-5" />, color: "#00E5FF", title: "Live Zoom & Recordings", body: "Flexible timing with full session recordings for review anytime." },
                ].map((perk) => (
                    <div
                        key={perk.title}
                        className="backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl p-5 flex items-start gap-4"
                        style={{ background: `${perk.color}08` }}
                    >
                        <div className="p-2.5 rounded-xl shrink-0 text-white shadow-lg" style={{ background: perk.color }}>
                            {perk.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">{perk.title}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{perk.body}</p>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
