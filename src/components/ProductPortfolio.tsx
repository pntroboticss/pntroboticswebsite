"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { Shield, Zap, Lightbulb, ImageIcon, ChevronRight, Cpu, Eye } from "lucide-react";
import Image from "next/image";

type Product = {
    name: string;
    description: string;
    image?: string;
    chips: string[];
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
        icon: <Lightbulb size={18} />,
        products: [
            {
                name: "Coro Bot",
                description: "World's first Internet-controlled robot developed for health professionals doing frontline duty.",
                chips: ["Internet-Controlled", "Telepresence"]
            },
            {
                name: "ADO Advertisement Bot",
                description: "An AI-powered advertisement robot. It is a fully automated humanoid that mimics human-like emotions and gestures to enhance interaction.",
                chips: ["AI-Powered", "Humanoid"]
            },
            {
                name: "AGV",
                description: "Designed for hospitality, warehousing, medical, and custom applications. Supports Line-based & LIDAR-based navigation with obstacle sensors.",
                chips: ["LIDAR", "Obstacle Avoidance"]
            },
            {
                name: "HUL Handwash Automation Rig",
                description: "Ideal for detergent & textile manufacturers to test cleaning agents. Precision execution replicates handwashing for accurate stain removal evaluation.",
                chips: ["Precision Testing", "Automation"]
            },
            {
                name: "Wockhardt Delivery Robot",
                description: "Autonomous desk-to-desk file and stationery delivery robot featuring real-time obstacle avoidance and a 30 kg payload capacity.",
                chips: ["30kg Payload", "Autonomous"]
            },
            {
                name: "Agriculture Robot",
                description: "Customizable robot that helps farmers optimize operations. Supports seed sowing, pesticide spraying, ploughing, and weed cutting.",
                chips: ["Customizable", "Multi-role"]
            }
        ]
    },
    {
        id: "power",
        label: "Power Industry Robots",
        icon: <Zap size={18} />,
        products: [
            {
                name: "Tata Power Grounding Robot",
                description: "Switchyard automation robot that automates grounding for GOD systems. Features a 9m extender, auto-adjustment, and hands-free encrypted bluetooth operation.",
                chips: ["9m Extender", "Bluetooth"]
            },
            {
                name: "Tata Power Universal Robot",
                description: "Advanced robot that performs grounding operations, cleans insulators, and detects potentials remotely. Features a broad base for stability and a 9-meter reach.",
                chips: ["SCADA Integrated", "Remote Detection"]
            },
            {
                name: "Tata Power RiRO",
                description: "Autonomous robot engineered for Siemens Breakers that performs rack-in/rack-out tasks without human intervention. Fully integrated with SCADA.",
                chips: ["Fully Autonomous", "Breaker Rack"]
            },
            {
                name: "Tata Power Battery Lifting",
                description: "System consisting of a lifting mechanism and trolley robot, developed specifically to securely move and transport Exide battery models.",
                chips: ["Trolley System", "Heavy Lifting"]
            },
            {
                name: "Tata Power GSM Module",
                description: "GSM-based alert system providing early warning for water levels. Sends automated text alerts and calls the user for abnormalities like motor shutdowns.",
                chips: ["Real-time Alerts", "GSM"]
            }
        ]
    },
    {
        id: "defence",
        label: "Products for Defence",
        icon: <Shield size={18} />,
        products: [
            {
                name: "Riskiest Ship Assessment",
                description: "Developed with the Indian Navy for real-time ship risk analysis. Uses Radar & AIS data to compute CPA & TCPA, letting AI dynamically identify the highest-risk ship.",
                chips: ["Radar & AIS", "AI Analytics"]
            },
            {
                name: "Indian Army Sensor Scout",
                description: "Man-pack system using sensor-fusion technology to ensure uninterrupted navigation and accurate trajectory estimation in GPS-denied environments.",
                chips: ["GPS-Denied", "Sensor Fusion"]
            },
            {
                name: "Car Pack-Steel-Sight",
                description: "Designed for tracked and wheeled armoured vehicles. Uses offline map integration and sensor fusion for live navigation under jamming and harsh battlefield conditions.",
                chips: ["Jam-Resistant", "Live Nav"]
            },
            {
                name: "Kamikaze Drone",
                description: "Remote control precision strike drone that attacks by crashing. Max capacity 3kg high-explosive warhead, featuring a 1.5 km line-of-sight range with live feedback.",
                chips: ["3kg Warhead", "1.5km Range"]
            }
        ]
    }
];

const ProductCard = ({ product, index, handleImageError, imageErrors }: { product: Product, index: number, handleImageError: any, imageErrors: any }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    // 3D Tilt physics
    const rotateX = useSpring(0, { stiffness: 400, damping: 40 });
    const rotateY = useSpring(0, { stiffness: 400, damping: 40 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setMousePos({ x, y });

        // Calculate rotation based on cursor position relative to center
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        rotateX.set(((y - centerY) / centerY) * -8); // Max tilt of 8 degrees
        rotateY.set(((x - centerX) / centerX) * 8);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        rotateX.set(0);
        rotateY.set(0);
    };

    // Asymmetric Bento Layout
    const isFeatured = index % 3 === 0;

    return (
        <motion.div
            ref={cardRef}
            style={{ 
                rotateX, 
                rotateY,
                transformPerspective: 1200
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative overflow-hidden rounded-[2rem] bg-[#0A0A0B] border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-shadow duration-500 flex flex-col ${isFeatured ? 'md:col-span-2' : ''} min-h-[450px] md:min-h-[500px]`}
        >
            {/* Absolute Background Image (Bleed) */}
            <div className="absolute inset-0 z-0">
                {product.image && !imageErrors[product.name] ? (
                    <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill 
                        className="object-cover scale-100 group-hover:scale-110 transition-transform duration-[2s] ease-out opacity-80 group-hover:opacity-100" 
                        onError={() => handleImageError(product.name)}
                        unoptimized
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#111214] text-white/20 transition-transform duration-[2s] ease-out scale-100 group-hover:scale-105">
                        <ImageIcon size={64} strokeWidth={0.5} className="mb-4" />
                        <span className="text-xs font-medium tracking-[0.2em] uppercase">No Render Available</span>
                    </div>
                )}
            </div>

            {/* Heavy Dark Overlay for Legibility */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-black/10 group-hover:from-black group-hover:via-black/40 group-hover:to-transparent transition-colors duration-700" />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Interactive Mouse-Follow Spotlight */}
            <div
                className="absolute inset-0 z-20 transition-opacity duration-300 pointer-events-none mix-blend-overlay"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.2), transparent 40%)`,
                }}
            />

            {/* Glowing Border Line on Hover */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out z-30" />

            {/* Content Section Overlay */}
            <div className={`relative z-30 flex flex-col flex-1 p-8 md:p-12 h-full justify-end`}>
                
                {/* Tech Chips (Top Right conceptually, but rendered in flow for mobile) */}
                <div className="absolute top-8 left-8 md:top-12 md:left-12 flex flex-wrap gap-2">
                    {product.chips.map((chip, cIdx) => (
                        <span key={cIdx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase bg-white/5 backdrop-blur-md text-white/70 border border-white/10 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors duration-500">
                            {chip}
                        </span>
                    ))}
                </div>

                <div className="mt-auto transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white mb-4 group-hover:text-cyan-400 transition-colors duration-500 drop-shadow-xl">
                        {product.name}
                    </h3>
                    
                    <div className="overflow-hidden">
                        <p className="text-white/70 font-light text-base md:text-lg leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                            {product.description}
                        </p>
                    </div>

                    {/* Hover Reveal Action */}
                    <div className="mt-8 flex items-center gap-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-cyan-500 group-hover:border-cyan-400 transition-colors duration-300">
                            <Eye size={18} />
                        </div>
                        <span className="text-sm font-semibold tracking-widest uppercase text-white/90">Explore Specs</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function ProductPortfolio({ fixedSectorId }: { fixedSectorId?: string }) {
    const [activeSector, setActiveSector] = useState(fixedSectorId || SECTORS[0].id);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const activeData = SECTORS.find(s => s.id === activeSector);

    const handleImageError = (productName: string) => {
        setImageErrors(prev => ({ ...prev, [productName]: true }));
    };

    return (
        <section id="portfolio" className="relative w-full py-32 bg-[#0A0A0B] transition-colors duration-700 overflow-hidden">
            
            {/* Engineering Grid & Mesh Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0" />
            
            {/* Coordinate Dots */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-[size:64px_64px] bg-[position:32px_32px] pointer-events-none z-0" />

            {/* Massive Radial Light Blooms (Lit Lab Effect) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-full opacity-40 pointer-events-none z-0 flex items-start justify-center">
                <div className="w-full aspect-square max-w-[800px] bg-blue-500/20 rounded-full blur-[150px] mix-blend-screen translate-y-[-20%]" />
            </div>
            <div className="absolute bottom-0 right-0 w-full max-w-[800px] h-full opacity-30 pointer-events-none z-0 flex items-end justify-end">
                <div className="w-full aspect-square max-w-[600px] bg-cyan-500/20 rounded-full blur-[120px] mix-blend-screen translate-y-[20%] translate-x-[20%]" />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12">
                
                {!fixedSectorId && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative text-center mb-24 flex flex-col items-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md text-white/60 font-semibold tracking-widest text-[10px] sm:text-xs uppercase mb-8 border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                            Hardware Systems
                        </div>
                        <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter mb-8 leading-[0.9] drop-shadow-2xl">
                            Next-Gen <br className="md:hidden" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                                Robotics
                            </span>
                        </h2>
                        <p className="text-lg md:text-2xl text-white/50 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
                            Explore our cutting-edge robotic solutions categorized by the industries we empower. Engineered for absolute precision, built for scale.
                        </p>
                    </motion.div>
                )}

                {/* Floating Transparent Dock Navigation */}
                {!fixedSectorId && (
                    <div className="flex justify-center mb-16 relative z-20">
                        <div className="inline-flex flex-wrap justify-center gap-2 p-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl">
                            {SECTORS.map((sector) => (
                                <button
                                    key={sector.id}
                                    onClick={() => setActiveSector(sector.id)}
                                    className={`relative flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                                        activeSector === sector.id
                                            ? "text-black"
                                            : "text-white/60 hover:text-white"
                                    }`}
                                >
                                    {activeSector === sector.id && (
                                        <motion.div
                                            layoutId="activeTabCinematic"
                                            className="absolute inset-0 bg-white rounded-full -z-10 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        <span className={activeSector === sector.id ? "text-black" : ""}>
                                            {sector.icon}
                                        </span>
                                        <span className={activeSector === sector.id ? "text-black" : ""}>
                                            {sector.label}
                                        </span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Asymmetric Bento Grid */}
                <div className="min-h-[800px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSector}
                            initial={{ opacity: 0, scale: 0.98, filter: "blur(20px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.98, filter: "blur(20px)" }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                        >
                            {activeData?.products.map((product, idx) => (
                                <ProductCard 
                                    key={idx} 
                                    product={product} 
                                    index={idx} 
                                    handleImageError={handleImageError} 
                                    imageErrors={imageErrors} 
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}
