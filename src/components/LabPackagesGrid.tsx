"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Printer, Wrench, Bot, Navigation, Activity, RadioTower, Hand } from "lucide-react";

const SCHOOL_PACKAGES = [
    {
        id: "electronics",
        title: "Electronics Lab",
        description: "Arduino, Sensors, Raspberry Pi",
        icon: Cpu,
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: "3dprint",
        title: "3D Printer Lab",
        description: "Flashforge 3D Printers, Rapid Prototyping",
        icon: Printer,
        color: "from-purple-500 to-pink-500"
    },
    {
        id: "mechanical",
        title: "Mechanical Lab",
        description: "Tools, Workstations, Hardware Building",
        icon: Wrench,
        color: "from-orange-500 to-amber-500"
    },
    {
        id: "humanoid",
        title: "Smart Humanoid Robot Lab",
        description: "Advanced bipedal robots for coding and interaction",
        icon: Bot,
        color: "from-emerald-500 to-teal-500"
    }
];

const COLLEGE_PACKAGES = [
    {
        id: "agv",
        title: "Industrial AGV",
        description: "Fully customizable Automated Guided Vehicles",
        icon: Navigation,
        color: "from-indigo-500 to-indigo-700"
    },
    {
        id: "robotic-arm",
        title: "Industrial Robotic Arm",
        description: "Multi-axis arms for pick-and-place and industrial tasks",
        icon: Activity,
        color: "from-rose-500 to-red-600"
    },
    {
        id: "drone",
        title: "Educational Drone Lab",
        description: "UAV building, flight dynamics, and drone programming",
        icon: RadioTower,
        color: "from-sky-500 to-blue-600"
    },
    {
        id: "robotic-hand",
        title: "Robotic Hand / AI Lab",
        description: "Advanced gripping mechanisms with integrated AI vision",
        icon: Hand,
        color: "from-fuchsia-500 to-purple-600"
    }
];

export default function LabPackagesGrid() {
    const [mode, setMode] = useState<"schools" | "colleges">("schools");

    const packages = mode === "schools" ? SCHOOL_PACKAGES : COLLEGE_PACKAGES;

    return (
        <div className="w-full">
            {/* Toggle Switch */}
            <div className="flex justify-center mb-16">
                <div className="relative flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-inner">
                    <button
                        onClick={() => setMode("schools")}
                        className={`relative z-10 px-8 py-3 text-sm md:text-base font-bold rounded-full transition-colors duration-300 ${mode === "schools" ? "text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                    >
                        For Schools
                    </button>
                    <button
                        onClick={() => setMode("colleges")}
                        className={`relative z-10 px-8 py-3 text-sm md:text-base font-bold rounded-full transition-colors duration-300 ${mode === "colleges" ? "text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                    >
                        For Colleges
                    </button>
                    {/* Animated pill background */}
                    <motion.div
                        className="absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-md z-0"
                        initial={false}
                        animate={{
                            left: mode === "schools" ? "0.375rem" : "50%"
                        }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Packages Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {packages.map((pkg) => (
                        <motion.div
                            key={pkg.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 group flex items-start gap-6 relative overflow-hidden"
                        >
                            {/* Glowing radial gradient on hover */}
                            <div className={`absolute -inset-24 bg-gradient-to-br ${pkg.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 blur-3xl transition-opacity duration-500 pointer-events-none rounded-full`} />

                            <div className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                                <pkg.icon className="w-8 h-8 text-white" />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                                    {pkg.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 text-lg">
                                    {pkg.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
