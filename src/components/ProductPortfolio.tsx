"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { Shield, Zap, Lightbulb, ImageIcon, ChevronRight, Cpu, Eye, Loader2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import NetworkBackground from "./NetworkBackground";

type Product = {
    id: string;
    name: string;
    description: string;
    image_url?: string;
    chips: string[];
    sector_id: string;
};

type Sector = {
    id: string;
    label: string;
    icon: React.ReactNode;
    products: Product[];
};

const BASE_SECTORS: Sector[] = [
    {
        id: "commercial",
        label: "Commercial Robots",
        icon: <Lightbulb size={18} />,
        products: []
    },
    {
        id: "power",
        label: "Power Industry Robots",
        icon: <Zap size={18} />,
        products: []
    },
    {
        id: "defence",
        label: "Products for Defence",
        icon: <Shield size={18} />,
        products: []
    }
];

const renderDescription = (text: string | null | undefined) => {
    if (!text) return null;
    // If the text contains bullet points strung together, split them nicely
    const parts = text.split(/(?=•)/).map(p => p.trim()).filter(Boolean);
    if (parts.length > 1 && text.includes('•')) {
        return (
            <ul className="space-y-3">
                {parts.map((part, i) => (
                    <li key={i} className={part.startsWith('•') ? "flex gap-3 items-start" : "mb-2"}>
                        {part.startsWith('•') ? (
                            <>
                                <span className="text-cyan-400 mt-1 shrink-0 text-sm opacity-80">•</span>
                                <span className="text-slate-600 dark:text-white/70 font-light text-base md:text-lg leading-relaxed">{part.substring(1).trim()}</span>
                            </>
                        ) : (
                            <span className="text-slate-600 dark:text-white/70 font-light text-base md:text-lg leading-relaxed">{part}</span>
                        )}
                    </li>
                ))}
            </ul>
        );
    }
    return <p className="text-slate-600 dark:text-white/70 font-light text-base md:text-lg leading-relaxed max-w-2xl whitespace-pre-wrap">{text}</p>;
};

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

    // Asymmetric Bento Layout (not applicable for Masonry, but keeping index for staggering)
    
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
            className={`group relative overflow-hidden rounded-[2rem] bg-slate-50 dark:bg-[#0A0A0B] border border-slate-200 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-shadow duration-500 inline-block w-full mb-6 lg:mb-8 break-inside-avoid`}
        >
            {/* Masonry Image Container - No fixed height */}
            <div className="relative w-full bg-slate-200/50 dark:bg-white/5 overflow-hidden">

                
                {product.image_url && !imageErrors[product.id] ? (
                    <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out relative z-0" 
                        onError={() => handleImageError(product.id)}
                    />
                ) : (
                    <div className="w-full aspect-video flex flex-col items-center justify-center text-slate-300 dark:text-white/20 relative z-0">
                        <ImageIcon size={64} strokeWidth={0.5} className="mb-4" />
                        <span className="text-xs font-medium tracking-[0.2em] uppercase">No Render Available</span>
                    </div>
                )}
            </div>

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
            <div className={`relative z-30 p-8 md:p-12 justify-start block`}>
                
                {/* Tech Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {product.chips.map((chip, cIdx) => (
                        <span key={cIdx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase bg-slate-200/50 dark:bg-white/5 backdrop-blur-md text-slate-600 dark:text-white/70 border border-slate-200 dark:border-white/10 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors duration-500">
                            {chip}
                        </span>
                    ))}
                </div>

                <div className="mt-auto transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-4 group-hover:text-cyan-400 transition-colors duration-500 drop-shadow-xl break-words hyphens-auto">
                        {product.name}
                    </h3>
                    
                    <div className="overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                        {renderDescription(product.description)}
                    </div>


                </div>
            </div>
        </motion.div>
    );
};

export default function ProductPortfolio({ fixedSectorId }: { fixedSectorId?: string }) {
    const [activeSector, setActiveSector] = useState(fixedSectorId || BASE_SECTORS[0].id);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    const [sectors, setSectors] = useState<Sector[]>(BASE_SECTORS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false });

        if (!error && data) {
            // Reconstruct sectors with fetched products
            const populatedSectors = BASE_SECTORS.map(sector => ({
                ...sector,
                products: data.filter((p: any) => p.sector_id === sector.id).map((p: any) => ({
                    ...p,
                    chips: p.chips || ["New", "Tech"] // fallback chips
                }))
            }));
            setSectors(populatedSectors);
        }
        setIsLoading(false);
    };

    const activeData = sectors.find(s => s.id === activeSector);

    const handleImageError = (productId: string) => {
        setImageErrors(prev => ({ ...prev, [productId]: true }));
    };

    return (
        <section id="portfolio" className="relative w-full py-32 bg-slate-50 dark:bg-[#0A0A0B] transition-colors duration-700 overflow-hidden">
            
            <div className="absolute inset-0 z-0">
                <NetworkBackground />
            </div>

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
                        <div className="mb-24 md:mb-32 max-w-4xl mx-auto">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 dark:bg-white/5 backdrop-blur-md text-slate-500 dark:text-white/60 font-semibold tracking-widest text-[10px] sm:text-xs uppercase mb-8 border border-slate-200 dark:border-white/10"
                            >
                                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                Hardware Systems
                            </motion.div>

                            <motion.h2 
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                                className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 leading-[0.9] drop-shadow-2xl"
                            >
                                Next-Gen <br className="md:hidden" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-600">
                                    Robotics
                                </span>
                            </motion.h2>

                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="text-lg md:text-2xl text-slate-500 dark:text-white/50 max-w-3xl mx-auto font-light leading-relaxed tracking-wide"
                            >
                                Explore our cutting-edge robotic solutions categorized by the industries we empower. Engineered for absolute precision, built for scale.
                            </motion.p>
                        </div>
                    </motion.div>
                )}

                {/* Floating Transparent Dock Navigation */}
                {!fixedSectorId && (
                    <div className="flex justify-center mb-16 relative z-20">
                        <div className="inline-flex flex-wrap justify-center gap-2 p-2 bg-slate-200/50 dark:bg-white/5 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl">
                            {sectors.map((sector) => (
                                <button
                                    key={sector.id}
                                    onClick={() => setActiveSector(sector.id)}
                                    className={`relative flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 ${
                                        activeSector === sector.id
                                            ? "text-black"
                                            : "text-slate-500 dark:text-white/60 hover:text-slate-900 dark:text-white"
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
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-cyan-500">
                            <Loader2 className="w-12 h-12 animate-spin mb-4" />
                            <p className="text-slate-500 dark:text-white/50 font-medium tracking-wide">Loading Database Models...</p>
                        </div>
                    ) : activeData?.products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-200/50 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 border-dashed">
                            <Lightbulb className="w-16 h-16 text-slate-400 dark:text-white/30 mb-4" />
                            <h3 className="text-xl font-bold text-slate-500 dark:text-white/50">No Products Found</h3>
                            <p className="text-slate-400 dark:text-white/40 mt-2">New {activeData.label} will be showcased here soon.</p>
                        </div>
                    ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSector}
                            initial={{ opacity: 0, scale: 0.98, filter: "blur(20px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.98, filter: "blur(20px)" }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="columns-1 md:columns-2 lg:columns-3 gap-6 lg:gap-8 space-y-6 lg:space-y-8"
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
                    )}
                </div>

            </div>
        </section>
    );
}
