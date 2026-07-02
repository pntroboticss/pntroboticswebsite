"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const clients = [
    { name: "BARC", src: "/images/clients/BARC.png" },
    { name: "DRDO", src: "/images/clients/DRDO.png" },
    { name: "Indian Army", src: "/images/clients/Indian Army.png" },
    { name: "KDMC", src: "/images/clients/KDMC.png" },
    { name: "Maharashtra Govt", src: "/images/clients/Maharashtra-govt-1.png" },
    { name: "Indian Navy", src: "/images/clients/Navy.png" },
    { name: "TATA", src: "/images/clients/TATA.png" },
    { name: "TMC", src: "/images/clients/TMC.png" },
    { name: "Unilever", src: "/images/clients/Unilever.png" },
    { name: "Wockhardt", src: "/images/clients/Wockhardt.png" },
];

export default function TrustedClients() {
    return (
        <section className="w-full py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 overflow-hidden transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 text-center mb-10">
                <h2 className="text-2xl md:text-4xl font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Trusted By Clients
                </h2>
            </div>

            <div className="relative flex w-full overflow-hidden">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10" />

                {/* Scrolling Track */}
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 40, repeat: Infinity }}
                    className="flex w-max items-center"
                >
                    {[...clients, ...clients].map((client, i) => (
                        <div key={i} className="flex-none px-8 md:px-12 flex justify-center items-center">
                            <div className="relative h-24 md:h-28 w-40 md:w-56 flex items-center justify-center transition-transform duration-300 hover:scale-110 drop-shadow-sm hover:drop-shadow-xl z-0 hover:z-10 cursor-pointer">
                                <Image
                                    src={client.src}
                                    alt={client.name}
                                    fill
                                    sizes="(max-width: 768px) 160px, 224px"
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
