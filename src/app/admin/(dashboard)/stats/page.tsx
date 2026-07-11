"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Save, Target } from "lucide-react";
import toast from "react-hot-toast";

type StatsData = {
    id: string;
    years_of_excellence: number;
    custom_robots: number;
    automation_systems: number;
    happy_clients: number;
};

export default function AdminStats() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("homepage_stats")
            .select("*")
            .limit(1)
            .single();

        if (data && !error) {
            setStats(data);
        } else {
            console.error("Error fetching stats:", error);
            // Default fallback if table is empty
            setStats({
                id: "",
                years_of_excellence: 10,
                custom_robots: 50,
                automation_systems: 100,
                happy_clients: 200
            });
        }
        setIsLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stats) return;

        setIsSaving(true);
        const toastId = toast.loading("Saving stats...");

        try {
            const dataToUpdate = {
                years_of_excellence: stats.years_of_excellence,
                custom_robots: stats.custom_robots,
                automation_systems: stats.automation_systems,
                happy_clients: stats.happy_clients,
                updated_at: new Date().toISOString()
            };

            let error;

            if (stats.id) {
                // Update existing row
                const res = await supabase.from("homepage_stats").update(dataToUpdate).eq("id", stats.id);
                error = res.error;
            } else {
                // Insert new row
                const res = await supabase.from("homepage_stats").insert([dataToUpdate]);
                error = res.error;
            }

            if (error) throw error;

            toast.success("Homepage stats updated successfully!", { id: toastId });
            await fetchStats();
        } catch (error: any) {
            console.error(error);
            toast.error(`Failed to update stats: ${error.message}`, { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    const handleNumberChange = (field: keyof StatsData, value: string) => {
        if (!stats) return;
        const num = parseInt(value) || 0;
        setStats({ ...stats, [field]: num });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Homepage Stats Ribbon</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Manage the numbers displayed in the glowing stats ribbon on the homepage.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center gap-3">
                    <Target className="w-6 h-6 text-indigo-500" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Current Statistics</h2>
                </div>

                <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Years of Excellence</label>
                            <div className="relative">
                                <input 
                                    type="number"
                                    min="0"
                                    value={stats?.years_of_excellence || 0}
                                    onChange={(e) => handleNumberChange("years_of_excellence", e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-lg font-bold"
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Happy Clients</label>
                            <div className="relative">
                                <input 
                                    type="number"
                                    min="0"
                                    value={stats?.happy_clients || 0}
                                    onChange={(e) => handleNumberChange("happy_clients", e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-lg font-bold"
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Automation Systems</label>
                            <div className="relative">
                                <input 
                                    type="number"
                                    min="0"
                                    value={stats?.automation_systems || 0}
                                    onChange={(e) => handleNumberChange("automation_systems", e.target.value)}
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white text-lg font-bold"
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+</div>
                            </div>
                        </div>

                    </div>

                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-500/20"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
