"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Trash2, Plus, Image as ImageIcon } from "lucide-react";

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Form State
    const [author, setAuthor] = useState("");
    const [role, setRole] = useState("");
    const [company, setCompany] = useState("");
    const [quote, setQuote] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from("client_testimonials").select("*").order("created_at", { ascending: false });
        if (!error && data) setTestimonials(data);
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!author || !quote || !company || !role) return;
        
        setIsSubmitting(true);
        let photoUrl = null;

        try {
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                
                const { data, error } = await supabase.storage.from("testimonial_photos").upload(fileName, file);
                
                if (error) throw error;
                
                const { data: publicUrlData } = supabase.storage.from("testimonial_photos").getPublicUrl(data.path);
                photoUrl = publicUrlData.publicUrl;
            }

            const { error } = await supabase.from("client_testimonials").insert([{
                author, role, company, quote, photo_url: photoUrl
            }]);

            if (error) throw error;

            // Reset form
            setAuthor(""); setRole(""); setCompany(""); setQuote(""); setFile(null);
            alert("Testimonial added successfully!");
            fetchTestimonials();
        } catch (err) {
            console.error(err);
            alert("Failed to add testimonial.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, photoUrl: string | null) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;
        
        // Delete row
        await supabase.from("client_testimonials").delete().eq("id", id);
        
        // Try to delete image from storage if it exists
        if (photoUrl) {
            const fileName = photoUrl.split('/').pop();
            if (fileName) {
                await supabase.storage.from("testimonial_photos").remove([fileName]);
            }
        }
        
        fetchTestimonials();
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Testimonials Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Add, view, and remove testimonials from your website's homepage.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Add Form */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 h-fit">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                        <Plus className="w-5 h-5 text-blue-500" />
                        Add New
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Author Name *</label>
                            <input type="text" required value={author} onChange={e => setAuthor(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 text-slate-900 dark:text-white" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Role *</label>
                            <input type="text" required value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 text-slate-900 dark:text-white" placeholder="CEO" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Company *</label>
                            <input type="text" required value={company} onChange={e => setCompany(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 text-slate-900 dark:text-white" placeholder="TechCorp" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Quote *</label>
                            <textarea required rows={4} value={quote} onChange={e => setQuote(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:border-blue-500 resize-none text-slate-900 dark:text-white" placeholder="This company is amazing because..." />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Photo / Logo</label>
                            <div className="flex items-center gap-4">
                                <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm font-medium text-slate-500 dark:text-slate-400">
                                    <ImageIcon className="w-4 h-4" />
                                    <span className="truncate max-w-[150px]">{file ? file.name : "Choose Image"}</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                                </label>
                                {file && (
                                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                                )}
                            </div>
                        </div>
                        
                        <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex justify-center items-center gap-2">
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add Testimonial"}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-500">
                            No testimonials yet. Add your first one on the left!
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-4">
                            <AnimatePresence>
                                {testimonials.map((t) => (
                                    <motion.div 
                                        key={t.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-4 mb-4">
                                                {t.photo_url ? (
                                                    <img src={t.photo_url} alt={t.author} className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 font-bold text-xl">
                                                        {t.author.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{t.author}</h3>
                                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{t.role} @ {t.company}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 italic line-clamp-4">"{t.quote}"</p>
                                        </div>
                                        
                                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                                            <button 
                                                onClick={() => handleDelete(t.id, t.photo_url)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                title="Delete Testimonial"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
