"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Briefcase, GraduationCap, TrendingUp, X, Database, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface AdminStats {
    galleryCount: number;
    schoolsCount: number;
    internshipsCount: number;
    totalVisits: number;
    dbSizeInBytes: number;
    cloudinaryUsageMB: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        // Check local storage for welcome message
        const hasSeenWelcome = localStorage.getItem("pnt_admin_welcome_seen");
        if (!hasSeenWelcome) {
            setShowWelcome(true);
        }

        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats");
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setStats(data.data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const dismissWelcome = () => {
        localStorage.setItem("pnt_admin_welcome_seen", "true");
        setShowWelcome(false);
    };

    // Calculate MongoDB Storage (Free tier is 512MB = 536,870,912 bytes)
    const maxStorageBytes = 536870912;
    const currentStorageBytes = stats?.dbSizeInBytes || 0;
    const storagePercentage = Math.min((currentStorageBytes / maxStorageBytes) * 100, 100);
    const storageMegabytes = (currentStorageBytes / (1024 * 1024)).toFixed(2);

    // Calculate Cloudinary Storage (Free tier is 25 Credits = ~25GB = 25600 MB)
    const maxCloudinaryMB = 25600;
    const currentCloudinaryMB = stats?.cloudinaryUsageMB || 0;
    const cloudinaryPercentage = Math.min((currentCloudinaryMB / maxCloudinaryMB) * 100, 100);

    const STATS = [
        { label: "Gallery Photos", value: loading ? "-" : stats?.galleryCount || 0, icon: ImageIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Partner Schools", value: loading ? "-" : stats?.schoolsCount || 0, icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Internships", value: loading ? "-" : stats?.internshipsCount || 0, icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Total Visits", value: loading ? "-" : stats?.totalVisits?.toLocaleString() || 0, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
    ];

    return (
        <div className="space-y-8 relative">
            <AnimatePresence>
                {showWelcome && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4">
                            <button onClick={dismissWelcome} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm">
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>
                        <div className="relative z-10 max-w-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome to your new Dashboard!</h2>
                            </div>
                            <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                                This panel controls the live content on the PNT Academy website. Any changes you make here (adding partner logos, gallery images, or updating settings) will instantly sync with the global MongoDB cluster and update the main website in real-time.
                            </p>
                            <button onClick={dismissWelcome} className="px-6 py-3 bg-white text-blue-900 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm">
                                Get Started
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="mb-10">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight"
                >
                    Overview
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-500 dark:text-slate-400 mt-2 text-lg"
                >
                    Real-time metrics from your MongoDB cluster.
                </motion.p>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                                    {loading ? (
                                        <span className="w-12 h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse inline-block"></span>
                                    ) : (
                                        stat.value
                                    )}
                                </h3>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                {/* Main Action Modules */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group shadow-lg flex flex-col"
                    >
                        <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                            <ImageIcon className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Live Media Library</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm flex-1">
                            Upload and organize new photos for the public student projects gallery, workshops, and lab setups.
                        </p>
                        <Link href="/admin/gallery" className="inline-block w-fit px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all text-sm">
                            Manage Gallery ➔
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group shadow-lg flex flex-col"
                    >
                        <div className="absolute -right-12 -top-12 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors duration-500"></div>
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                            <GraduationCap className="w-7 h-7 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Partner Network</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm flex-1">
                            Add or remove logos from the "Trusted by Innovative Schools" and "Internships" public website sections.
                        </p>
                        <Link href="/admin/schools" className="inline-block w-fit px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all text-sm">
                            Manage Partners ➔
                        </Link>
                    </motion.div>
                </div>

                {/* MongoDB Storage Gauge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-slate-950 rounded-3xl p-8 relative overflow-hidden shadow-xl border border-slate-800 text-white flex flex-col justify-between"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-emerald-500/20 rounded-xl">
                                <Database className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-bold">MongoDB Storage</h2>
                        </div>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                            Your database is optimized to store highly compressed Base64 images and text. The free tier gives you 512MB, capable of holding tens of thousands of records.
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <span className="text-3xl font-black text-white">
                                    {loading ? "-" : storageMegabytes}
                                </span>
                                <span className="text-slate-400 text-sm ml-1 font-medium">MB Used</span>
                            </div>
                            <span className="text-emerald-400 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-full">
                                {loading ? "-" : storagePercentage.toFixed(2)}%
                            </span>
                        </div>

                        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-3">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${storagePercentage}%` }}
                                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full relative"
                            >
                                <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"></div>
                            </motion.div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 font-medium tracking-wide border-t border-slate-800 pt-3">
                            <span>0 MB</span>
                            <span>512 MB (Free Tier Limit)</span>
                        </div>
                    </div>
                </motion.div>

                {/* Cloudinary Media Storage Gauge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-slate-950 rounded-3xl p-8 relative overflow-hidden shadow-xl border border-slate-800 text-white flex flex-col justify-between"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <ImageIcon className="w-6 h-6 text-blue-400" />
                            </div>
                            <h2 className="text-xl font-bold">Cloudinary Media</h2>
                        </div>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                            Dedicated cloud storage for massive 4K gallery images, student photos, and video assets. Enjoy up to ~25GB totally free on this tier.
                        </p>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <span className="text-3xl font-black text-white">
                                    {loading ? "-" : currentCloudinaryMB.toFixed(2)}
                                </span>
                                <span className="text-slate-400 text-sm ml-1 font-medium">MB Used</span>
                            </div>
                            <span className="text-blue-400 text-sm font-bold bg-blue-500/10 px-3 py-1 rounded-full">
                                {loading ? "-" : cloudinaryPercentage.toFixed(2)}%
                            </span>
                        </div>

                        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-3">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${cloudinaryPercentage}%` }}
                                transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full relative"
                            >
                                <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"></div>
                            </motion.div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 font-medium tracking-wide border-t border-slate-800 pt-3">
                            <span>0 GB</span>
                            <span>25 GB (Free Tier Limit)</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
