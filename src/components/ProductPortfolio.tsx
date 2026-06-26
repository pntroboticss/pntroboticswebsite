"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Shield, Zap, Lightbulb, ImageIcon } from "lucide-react";
import Image from "next/image";

type Product = {
    name: string;
    description: string;
    image?: string;
};

type Sector = {
    id: string;
    label: string;
    icon: React.ReactNode;
    products: Product[];
};

const SECTORS: Sector[] = [
    {
        id: "commercial",
        label: "Commercial Robots",
        icon: <Lightbulb size={20} />,
        products: [
            {
                name: "Coro Bot",
                description: "World's first Internet-controlled robot developed for health professionals doing frontline duty.",
                image: "/images/products/coro-bot.jpg"
            },
            {
                name: "ADO Advertisement Bot",
                description: "An AI-powered advertisement robot. It is a fully automated humanoid that mimics human-like emotions and gestures to enhance interaction.",
                image: "/images/products/ado-advertisement-bot.jpg"
            },
            {
                name: "AGV (Autonomous Guided Vehicle)",
                description: "Designed for hospitality, warehousing, medical, and custom applications. Supports Line-based & LIDAR-based navigation with obstacle sensors.",
                image: "/images/products/agv-agriculture-robots.jpg"
            },
            {
                name: "HUL Handwash Automation Rig",
                description: "Ideal for detergent & textile manufacturers to test cleaning agents. Precision execution replicates handwashing for accurate stain removal evaluation.",
                image: "/images/products/hul-handwash-rig.jpg"
            },
            {
                name: "Wockhardt Delivery Robot",
                description: "Autonomous desk-to-desk file and stationery delivery robot featuring real-time obstacle avoidance and a 30 kg payload capacity.",
                image: "/images/products/wockhardt-delivery-robot.jpg"
            },
            {
                name: "Agriculture Robot",
                description: "Customizable robot that helps farmers optimize operations. Supports seed sowing, pesticide spraying, ploughing, and weed cutting.",
                image: "/images/products/agriculture-robot.jpg"
            }
        ]
    },
    {
        id: "power",
        label: "Power Industry Robots",
        icon: <Zap size={20} />,
        products: [
            {
                name: "Tata Power Grounding Robot",
                description: "Switchyard automation robot that automates grounding for GOD systems. Features a 9m extender, auto-adjustment, and hands-free encrypted bluetooth operation.",
                image: "/images/products/grounding-universal-robots.jpg"
            },
            {
                name: "Tata Power Universal Robot",
                description: "Advanced robot that performs grounding operations, cleans insulators, and detects potentials remotely. Features a broad base for stability and a 9-meter reach.",
                image: "/images/products/universal-robot.jpg"
            },
            {
                name: "Tata Power RiRO",
                description: "Autonomous robot engineered for Siemens Breakers that performs rack-in/rack-out tasks without human intervention. Fully integrated with SCADA.",
                image: "/images/products/riro.jpg"
            },
            {
                name: "Tata Power Battery Lifting",
                description: "System consisting of a lifting mechanism and trolley robot, developed specifically to securely move and transport Exide battery models.",
                image: "/images/products/battery-lifting-robot.jpg"
            },
            {
                name: "Tata Power GSM Module",
                description: "GSM-based alert system providing early warning for water levels. Sends automated text alerts and calls the user for abnormalities like motor shutdowns.",
                image: "/images/products/power-alert-gsm-module.jpg"
            }
        ]
    },
    {
        id: "defence",
        label: "Products for Defence",
        icon: <Shield size={20} />,
        products: [
            {
                name: "Riskiest Ship Assessment",
                description: "Developed with the Indian Navy for real-time ship risk analysis. Uses Radar & AIS data to compute CPA & TCPA, letting AI dynamically identify the highest-risk ship.",
                image: "/images/products/riskiest-ship-assessment.jpg"
            },
            {
                name: "Indian Army Sensor Scout",
                description: "Man-pack system using sensor-fusion technology to ensure uninterrupted navigation and accurate trajectory estimation in GPS-denied environments.",
                image: "/images/products/sensorscout.jpg"
            },
            {
                name: "Car Pack-Steel-Sight",
                description: "Designed for tracked and wheeled armoured vehicles. Uses offline map integration and sensor fusion for live navigation under jamming and harsh battlefield conditions.",
                image: "/images/products/carpack-steel-signt.jpg"
            },
            {
                name: "Kamikaze Drone",
                description: "Remote control precision strike drone that attacks by crashing. Max capacity 3kg high-explosive warhead, featuring a 1.5 km line-of-sight range with live feedback.",
                image: "/images/products/kamikaze-drone.jpg"
            }
        ]
    }
];

export default function ProductPortfolio({ fixedSectorId }: { fixedSectorId?: string }) {
    const [activeSector, setActiveSector] = useState(fixedSectorId || SECTORS[0].id);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const activeData = SECTORS.find(s => s.id === activeSector);

    const handleImageError = (productName: string) => {
        setImageErrors(prev => ({ ...prev, [productName]: true }));
    };

    return (
        <section id="portfolio" className="w-full py-24 bg-transparent transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                
                {!fixedSectorId && (
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                            Our Product Portfolio
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Explore our cutting-edge robotic solutions categorized by the industries we empower.
                        </p>
                    </div>
                )}

                {/* Tabs */}
                {!fixedSectorId && (
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {SECTORS.map((sector) => (
                            <button
                                key={sector.id}
                                onClick={() => setActiveSector(sector.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                                    activeSector === sector.id
                                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-105"
                                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                            >
                                {sector.icon}
                                {sector.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Content Grid */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSector}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
                        >
                            {activeData?.products.map((product, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-cyan-500/50 transition-all duration-300 group overflow-hidden flex flex-col">
                                    
                                    {/* Image Area */}
                                    <div className="relative w-full h-64 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                        {product.image && !imageErrors[product.name] ? (
                                            <Image 
                                                src={product.image} 
                                                alt={product.name} 
                                                fill 
                                                className="object-cover group-hover:scale-105 transition-transform duration-500" 
                                                onError={() => handleImageError(product.name)}
                                                unoptimized
                                            />
                                        ) : (
                                            // Fallback Placeholder if image fails to load or isn't provided
                                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/5 dark:to-blue-500/5 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                                <ImageIcon size={48} className="mb-2 opacity-50" />
                                                <span className="text-sm font-medium">Image Not Provided</span>
                                                <span className="text-xs opacity-50 mt-1">{product.image}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Text Content */}
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                                            {product.name}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}
