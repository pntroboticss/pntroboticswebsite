"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import ImageCropper from "@/components/admin/ImageCropper";
import { supabase } from "@/lib/supabase";

const PAGE_LOCATIONS = ["Home", "About Us", "Gallery", "Schools", "Contact"];
const CATEGORIES: Record<string, string[]> = {
    "Home": ["Hero Slider", "Spotlight", "Testimonials", "Partners"],
    "About Us": ["Team", "Office", "History"],
    "Gallery": ["Projects", "Workshop", "Industrial Visit", "Schools", "Lab Setup", "Robotics Lab"],
    "Schools": ["Testimonials", "Curriculum in Action"],
    "Contact": ["Location Map", "Office Front"],
};

export default function AdminGallery() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // Form State
    const [file, setFile] = useState<File | null>(null);
    const [fileToCrop, setFileToCrop] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [pageLocation, setPageLocation] = useState("Gallery");
    const [category, setCategory] = useState("Projects");
    
    // UI state for viewing
    const [activeTab, setActiveTab] = useState("Gallery");

    useEffect(() => {
        // Automatically update category when page location changes to ensure valid selection
        if (CATEGORIES[pageLocation] && !CATEGORIES[pageLocation].includes(category)) {
            setCategory(CATEGORIES[pageLocation][0]);
        }
    }, [pageLocation]);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const res = await fetch("/api/admin/gallery");
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleFileSelect = (selectedFile: File | undefined) => {
        if (!selectedFile) return;
        if (selectedFile.type === "image/gif") {
            setFile(selectedFile);
        } else {
            setFileToCrop(selectedFile);
        }
    };

    const handleCropComplete = (croppedFile: File) => {
        setFile(croppedFile);
        setFileToCrop(null);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;
        setIsUploading(true);

        try {
            // 1. Upload to Supabase Storage
            const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
            const { data, error: uploadError } = await supabase.storage
                .from("website_assets")
                .upload(`gallery/${uniqueFilename}`, file, { cacheControl: "3600", upsert: false });

            if (uploadError) throw new Error("Supabase upload failed");
            
            const { data: publicUrlData } = supabase.storage
                .from("website_assets")
                .getPublicUrl(`gallery/${uniqueFilename}`);
            const secureUrl = publicUrlData.publicUrl;

            // 2. Save directly to MongoDB API
            const res = await fetch("/api/admin/gallery", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    title,
                    category,
                    pageLocation,
                    imageUrl: secureUrl,
                }),
            });

            if (res.ok) {
                setFile(null);
                setTitle("");
                await fetchGallery();
            } else {
                console.error("Failed to upload image to MongoDB layer.");
            }
            setIsUploading(false);
        } catch (error) {
            console.error("Upload Error", error);
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!confirm("Are you sure you want to delete this photo forever?")) return;

        try {
            const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                // In a production app, you might also want to delete the file from Firebase Storage here using deleteObject(ref(storage, imageUrl))
                setItems(items.filter((item) => item._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="space-y-6">
            <header className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Gallery Media Library</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-lg">
                        Upload and manage photos actively displayed on the main website's project categories.
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
                        <Plus className="w-5 h-5 text-blue-500" /> Add New Photo
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Photo Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Students building Rover bot"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Website Page</label>
                            <select
                                value={pageLocation}
                                onChange={(e) => setPageLocation(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                {PAGE_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Section / Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                {(CATEGORIES[pageLocation] || []).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Image File</label>
                        <input
                            type="file"
                            required={!file}
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e.target.files?.[0])}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 transition-colors"
                        />
                        {file && <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-semibold">✓ Image ready for upload</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isUploading || !file}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                        {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : 'Upload & Publish to Website'}
                    </button>
                </form>
            </motion.div>

            {/* Media Manager Header & Tabs */}
            <div className="flex flex-col gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Uploaded Media</h3>
                
                <div className="flex flex-wrap gap-2 mb-2">
                    {PAGE_LOCATIONS.map(loc => (
                        <button
                            key={loc}
                            onClick={() => setActiveTab(loc)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                activeTab === loc
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                    : "bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                            }`}
                        >
                            {loc}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-12 flex justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : items.filter(i => (i.pageLocation || "Gallery") === activeTab).length === 0 ? (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                        <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-500">No media uploaded for {activeTab} yet.</p>
                    </div>
                ) : (
                    items.filter(i => (i.pageLocation || "Gallery") === activeTab).map((item, i) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm"
                        >
                            <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800/50 relative">
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-3">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 whitespace-nowrap mb-1 block">
                                        {item.category}
                                    </span>
                                    <h4 className="text-white font-medium text-sm truncate">{item.title}</h4>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(item._id, item.imageUrl)}
                                className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all shadow-lg"
                                title="Delete Photo"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Render Cropper Modal if a file needs cropping */}
            {fileToCrop && (
                <ImageCropper 
                    file={fileToCrop} 
                    aspectRatio={16 / 9} // Widescreen for gallery
                    onCropComplete={handleCropComplete} 
                    onCancel={() => setFileToCrop(null)} 
                />
            )}
        </div>
    );
}
