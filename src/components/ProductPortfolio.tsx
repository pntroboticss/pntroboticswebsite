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
        id: "healthcare",
        label: "Healthcare & Medical",
        icon: <Activity size={20} />,
        products: [
            {
                name: "Coro-Bot",
                description: "A medical robot designed to assist frontline workers by dispensing food, water, and medicines, featuring remote audio-visual communication and temperature monitoring.",
                image: "/images/products/coro-bot.jpg"
            },
            {
                name: "Wockhardt Delivery Robot",
                description: "An autonomous desk-to-desk delivery robot with a 30 kg payload capacity, real-time obstacle avoidance, and a flame-resistant battery.",
                image: "/images/products/wockhardt-delivery-robot.jpg"
            }
        ]
    },
    {
        id: "defense",
        label: "Defense & Security",
        icon: <Shield size={20} />,
        products: [
            {
                name: "SensorScout (Indian Army)",
                description: "Available in Man Pack and Car Pack versions, providing sensor-fusion navigation for soldiers and armored vehicles in GPS-denied environments.",
                image: "/images/products/sensorscout.jpg"
            },
            {
                name: "Kamikaze Drone (Indian Army)",
                description: "A remote-control precision strike drone with a 3 kg payload and a 1.5 km line-of-sight operational range.",
                image: "/images/products/kamikaze-drone.jpg"
            },
            {
                name: "Riskiest Ship Assessment (Indian Navy)",
                description: "An AI assistant that utilizes Radar and AIS data for real-time ship risk analysis.",
                image: "/images/products/riskiest-ship-assessment.jpg"
            }
        ]
    },
    {
        id: "industrial",
        label: "Industrial Automation & Power",
        icon: <Zap size={20} />,
        products: [
            {
                name: "Grounding & Universal Robots",
                description: "Automated switchyard robots with a 9m extender, encrypted Bluetooth control, and the ability to clean insulators remotely.",
                image: "/images/products/grounding-universal-robots.jpg"
            },
            {
                name: "RIRO",
                description: "An autonomous robot for rack-in/rack-out tasks on Siemens breakers, featuring SCADA integration and a self-charging system.",
                image: "/images/products/riro.jpg"
            },
            {
                name: "Battery Lifting Robot",
                description: "Capable of lifting 200 kg off-center weights and transporting 150 kg payloads via a trolley robot.",
                image: "/images/products/battery-lifting-robot.jpg"
            },
            {
                name: "Power Alert GSM Module",
                description: "A three-level water detection system that sends automated alerts via GSM and phone calls.",
                image: "/images/products/power-alert-gsm-module.jpg"
            }
        ]
    },
    {
        id: "commercial",
        label: "Commercial & R&D",
        icon: <Lightbulb size={20} />,
        products: [
            {
                name: "ADO Advertisement Bot",
                description: "An AI-powered, fully automated humanoid that mimics human emotions to deliver interactive advertising experiences.",
                image: "/images/products/ado-advertisement-bot.jpg"
            },
            {
                name: "BARC Robotic Arm",
                description: "A precise robotic arm for assembly and welding tasks, suitable for heavy-duty industrial applications.",
                image: "/images/products/barc-robotic-arm.jpg"
            },
            {
                name: "Hindustan Unilever Handwash Rig",
                description: "An automated rig equipped with sensors to replicate handwashing for R&D and quality control testing.",
                image: "/images/products/hul-handwash-rig.jpg"
            },
            {
                name: "AGV & Agriculture Robots",
                description: "Autonomous Guided Vehicles with LIDAR navigation, alongside customizable agricultural robots for seed sowing, spraying, and weed cutting.",
                image: "/images/products/agv-agriculture-robots.jpg"
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
