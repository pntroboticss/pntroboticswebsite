"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

type Service = {
    id: string;
    title: string;
    description: string;
    image_url: string;
};

const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"],
    });

    // 3D animation transforms based on scroll
    // As it scrolls up, the perspective changes from tilted to flat to tilted away
    const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
    
    // Smooth out the animation with spring physics
    const smoothRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
    const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

    const isEven = index % 2 === 0;

    return (
        <motion.div
            ref={cardRef}
            style={{
                rotateX: smoothRotateX,
                scale: smoothScale,
                opacity,
            }}
            initial={{ x: isEven ? -100 : 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ type: "spring", duration: 1.2, bounce: 0.3 }}
            className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-16 items-center w-full max-w-6xl mx-auto my-32 perspective-1000`}
        >
            <div className="flex-1 w-full relative group">
                {/* Image Container with 3D shadow effect */}
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
                    {service.image_url ? (
                        <Image 
                            src={service.image_url} 
                            alt={service.title} 
                            fill 
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                            <ImageIcon className="w-16 h-16 text-slate-600" />
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex-1 w-full space-y-6 px-4 md:px-0">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="w-12 h-1 bg-cyan-500 mb-6 rounded-full" />
                    <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                        {service.title}
                    </h3>
                </motion.div>
                
                <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed"
                >
                    {service.description}
                </motion.p>
            </div>
        </motion.div>
    );
};

export default function ServicesList({ services }: { services: Service[] }) {
    if (!services || services.length === 0) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">New Services Coming Soon</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                    We are currently updating our service portfolio. Check back shortly to see our latest offerings.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full py-24 relative z-10" style={{ perspective: "1200px" }}>
            {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
            ))}
        </div>
    );
}
