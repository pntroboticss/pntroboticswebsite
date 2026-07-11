"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import { supabase } from "@/lib/supabase";

type StatItem = {
    label: string;
    value: number;
    suffix: string;
};

export default function StatsSection() {
    const [stats, setStats] = useState<StatItem[]>([
        { label: "Years of Excellence", value: 10, suffix: "+" },
        { label: "Custom Robots Built", value: 50, suffix: "+" },
        { label: "Automation Systems", value: 100, suffix: "+" },
        { label: "Happy Clients", value: 200, suffix: "+" },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            const { data, error } = await supabase
                .from("homepage_stats")
                .select("*")
                .limit(1)
                .single();

            if (data && !error) {
                setStats([
                    { label: "Years of Excellence", value: data.years_of_excellence, suffix: "+" },
                    { label: "Custom Robots Built", value: data.custom_robots, suffix: "+" },
                    { label: "Automation Systems", value: data.automation_systems, suffix: "+" },
                    { label: "Happy Clients", value: data.happy_clients, suffix: "+" },
                ]);
            }
        };

        fetchStats();
    }, []);

    return (
        <section className="relative py-16 bg-transparent transition-colors duration-500">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                        {stats.map((stat, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                className="flex flex-col items-center justify-center pt-8 md:pt-0 first:pt-0"
                            >
                                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 mb-2">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-sm md:text-base font-semibold text-slate-600 dark:text-slate-400">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
