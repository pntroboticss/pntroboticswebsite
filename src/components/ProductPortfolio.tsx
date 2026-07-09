"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Shield, Zap, Lightbulb, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type Product = {
    id: string;
    name: string;
    description: string;
    image_url?: string;
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
        icon: <Lightbulb size={20} />,
        products: []
    },
    {
        id: "power",
        label: "Power Industry Robots",
        icon: <Zap size={20} />,
        products: []
    },
    {
        id: "defence",
        label: "Products for Defence",
        icon: <Shield size={20} />,
        products: []
    }
];

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
                products: data.filter((p: Product) => p.sector_id === sector.id)
            }));
            setSectors(populatedSectors);
        }
        setIsLoading(false);
    };

    const activeData = sectors.find(s => s.id === activeSector);

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
                        {sectors.map((sector) => (
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
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] text-cyan-500">
                            <Loader2 className="w-12 h-12 animate-spin mb-4" />
                            <p className="text-slate-500 font-medium tracking-wide">Loading Database Models...</p>
                        </div>
                    ) : activeData?.products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                            <Lightbulb className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                            <h3 className="text-xl font-bold text-slate-400 dark:text-slate-500">No Products Found</h3>
                            <p className="text-slate-400 dark:text-slate-600 mt-2">New {activeData.label} will be showcased here soon.</p>
                        </div>
                    ) : (
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
                                        {product.image_url && !imageErrors[product.id] ? (
                                            <Image 
                                                src={product.image_url} 
                                                alt={product.name} 
                                                fill 
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500" 
                                                onError={() => handleImageError(product.id)}
                                                unoptimized
                                            />
                                        ) : (
                                            // Fallback Placeholder if image fails to load or isn't provided
                                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/5 dark:to-blue-500/5 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                                <ImageIcon size={48} className="mb-2 opacity-50" />
                                                <span className="text-sm font-medium">Image Not Provided</span>
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
                    )}
                </div>

            </div>
        </section>
    );
}
