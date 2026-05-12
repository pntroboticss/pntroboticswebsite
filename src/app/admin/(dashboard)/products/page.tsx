"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2, Box as BoxIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["Defense & Security", "Industrial Automation", "Healthcare & Service", "Commercial & R&D"];

export default function AdminProducts() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // Form State
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [specs, setSpecs] = useState(""); // comma separated

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (selectedFile: File | undefined) => {
        if (selectedFile) setFile(selectedFile);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !name) return;
        setIsUploading(true);

        try {
            // 1. Upload image to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError, data: uploadData } = await supabase.storage
                .from("website_assets")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from("website_assets")
                .getPublicUrl(filePath);

            // 2. Save product to Supabase Database
            const specsArray = specs.split(',').map(s => s.trim()).filter(s => s.length > 0);

            const { error: dbError } = await supabase
                .from("products")
                .insert([
                    {
                        name,
                        category,
                        specs: specsArray,
                        image_url: publicUrl
                    }
                ]);

            if (dbError) throw dbError;

            // Reset form
            setFile(null);
            setName("");
            setSpecs("");
            
            await fetchProducts();
        } catch (error) {
            console.error("Upload Error", error);
            alert("Failed to upload. Please ensure you ran the SQL policy allowing inserts.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!confirm("Are you sure you want to delete this product forever?")) return;

        try {
            // Optional: You could also delete the image from storage here
            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", id);

            if (error) throw error;
            
            setItems(items.filter((item) => item.id !== id));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="space-y-6">
            <header className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Products Catalog</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-lg">
                        Manage your robotic products and solutions displayed on the public website.
                    </p>
                </div>
            </header>

            {/* Upload Module */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-8"
            >
                <form onSubmit={handleUpload} className="flex-1 space-y-5">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <Plus className="w-5 h-5 text-indigo-500" /> Add New Product
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. ADO Humanoid"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Specifications (Comma Separated)</label>
                        <input
                            type="text"
                            value={specs}
                            onChange={(e) => setSpecs(e.target.value)}
                            placeholder="e.g. 3kg Payload, 1.5km LOS range, Real-time video"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Image</label>
                        <input
                            type="file"
                            required={!file}
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e.target.files?.[0])}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-50 dark:file:bg-indigo-900/30 file:text-indigo-700 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/50 transition-colors"
                        />
                        {file && <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-semibold">✓ Image ready for upload</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isUploading || !file}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                        {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</> : 'Upload & Publish Product'}
                    </button>
                </form>
            </motion.div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-12 flex justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                        <BoxIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-500">No products uploaded yet.</p>
                    </div>
                ) : (
                    items.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm flex flex-col"
                        >
                            <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800/50 relative">
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-3">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-300 whitespace-nowrap mb-1 block">
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-4 flex-1">
                                <h4 className="text-slate-900 dark:text-white font-bold text-lg mb-2">{item.name}</h4>
                                {item.specs && item.specs.length > 0 && (
                                    <ul className="space-y-1">
                                        {item.specs.slice(0, 2).map((spec: string, idx: number) => (
                                            <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                                {spec}
                                            </li>
                                        ))}
                                        {item.specs.length > 2 && (
                                            <li className="text-xs text-slate-500 italic mt-1">+ {item.specs.length - 2} more specs</li>
                                        )}
                                    </ul>
                                )}
                            </div>

                            <button
                                onClick={() => handleDelete(item.id, item.image_url)}
                                className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all shadow-lg"
                                title="Delete Product"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
