"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2, MessageSquareQuote } from "lucide-react";
import TestimonialManager from "@/components/admin/TestimonialManager";

function TestimonialCard({ item, index, onDelete }: { item: any; index: number; onDelete: (id: string) => void }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDeleteClick = async () => {
        if (!showConfirm) {
            setShowConfirm(true);
            setTimeout(() => setShowConfirm(false), 3000); // Auto-hide confirm after 3s
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/admin/testimonials?id=${item._id}`, { method: "DELETE" });
            if (res.ok) {
                onDelete(item._id);
            }
        } catch (error) {
            console.error(error);
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
            {/* Top right gradient blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Quote Icon Background */}
            <div className="absolute top-6 right-6 text-slate-100 dark:text-slate-800/80 pointer-events-none">
                <MessageSquareQuote className="w-16 h-16 transform -rotate-12" />
            </div>

            <div className="relative z-10 flex items-center gap-4 mb-6">
                <div className="relative">
                    <div className="w-14 h-14 relative rounded-full overflow-hidden shrink-0 border-2 border-slate-100 dark:border-slate-700 shadow-sm">
                        {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                        ) : (
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                {item.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    {item.logoUrl && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-white shadow-sm overflow-hidden flex items-center justify-center">
                            <img src={item.logoUrl} alt="Logo" className="w-full h-full object-contain p-0.5" />
                        </div>
                    )}
                </div>
                <div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-base tracking-wide flex items-center gap-2 flex-wrap">
                        {item.name}
                        {item.page === "employee" && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-bold uppercase tracking-wider">Employee</span>
                        )}
                        {item.page === "kids" && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">Kids</span>
                        )}
                        {item.page === "lab" && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 font-bold uppercase tracking-wider">Lab</span>
                        )}
                        {item.page === "college" && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">Colleges</span>
                        )}
                    </h4>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold mt-0.5">{item.role}</p>
                </div>
            </div>
            
            <p className="relative z-10 text-slate-600 dark:text-slate-300 text-[15px] italic leading-relaxed flex-1">
                "{item.quote}"
            </p>

            {/* Actions */}
            <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        showConfirm 
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    }`}
                >
                    {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Trash2 className="w-4 h-4" />
                    )}
                    {showConfirm ? "Sure?" : "Delete"}
                </button>
            </div>
        </motion.div>
    );
}

export default function AdminTestimonials() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch("/api/admin/testimonials");
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    return (
        <div className="space-y-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Student Testimonials</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-lg">
                    Manage the student and partner quotes displayed on the Home page, College Research Lab, and College Trainings page.
                </p>
            </header>

            {/* Upload Module */}
            <TestimonialManager />

            {/* Testimonials Grid */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Live Testimonials</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full py-12 flex justify-center text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                            <MessageSquareQuote className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                            <p className="text-slate-500">No testimonials published yet.</p>
                        </div>
                    ) : (
                        items.map((item, i) => (
                            <TestimonialCard 
                                key={item._id} 
                                item={item} 
                                index={i} 
                                onDelete={(id) => {
                                    setItems(prev => prev.filter(t => t._id !== id));
                                }} 
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
