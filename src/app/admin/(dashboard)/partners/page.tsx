"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2, Shield, Building2, Briefcase } from "lucide-react";
import ImageCropper from "@/components/admin/ImageCropper";

const CATEGORIES = [
    { id: "client", label: "Institute Partners (Colleges)", icon: Shield },
    { id: "hiring", label: "Internship & Placement Association", icon: Briefcase },
    { id: "industry", label: "Industry Associates", icon: Building2 },
];

export default function AdminPartners() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState("client");

    // Form State
    const [file, setFile] = useState<File | null>(null);
    const [fileToCrop, setFileToCrop] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("client");

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const res = await fetch("/api/admin/lab-partners");
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (selectedFile: File | undefined) => {
        if (!selectedFile) return;
        if (selectedFile.type === "image/gif" || selectedFile.type === "image/png" || selectedFile.type === "image/svg+xml") {
            setFile(selectedFile); // Don't crop transparent logos usually
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
        if (!file || !name) return;
        setIsUploading(true);

        try {
            // Upload to Cloudinary using unsigned preset
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "pnt_academy_unsigned");

            const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dycht8a6s/image/upload", {
                method: "POST",
                body: formData,
            });

            if (!cloudinaryRes.ok) throw new Error("Cloudinary upload failed");
            
            const cloudinaryData = await cloudinaryRes.json();
            const secureUrl = cloudinaryData.secure_url;

            // Save directly to MongoDB API
            const res = await fetch("/api/admin/lab-partners", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    name,
                    category,
                    imageUrl: secureUrl,
                }),
            });

            if (res.ok) {
                setFile(null);
                setName("");
                await fetchPartners();
            } else {
                console.error("Failed to upload partner to MongoDB layer.");
            }
            setIsUploading(false);
        } catch (error) {
            console.error("Upload Error", error);
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this partner logo?")) return;

        try {
            const res = await fetch(`/api/admin/lab-partners?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setItems(items.filter((item) => item._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    }

    const filteredItems = items.filter(item => item.category === activeTab);

    return (
        <div className="space-y-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Partners & Logos</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-2xl">
                    Manage client logos, hiring companies, and industry associates that appear across the website. 
                    For best results, upload PNG or SVG logos with transparent backgrounds.
                </p>
            </header>

            {/* Upload Module */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-8"
            >
                <form onSubmit={handleUpload} className="flex-1 space-y-5">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-500" /> Add New Logo
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company / Institution Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Tata Motors"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            >
                                {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Logo File (PNG/SVG preferred)</label>
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
                        {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : 'Upload Logo'}
                    </button>
                </form>
            </motion.div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pt-4">
                {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const isActive = activeTab === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                                isActive 
                                ? "border-blue-500 text-blue-600 dark:text-blue-400" 
                                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {cat.label} ({items.filter(i => i.category === cat.id).length})
                        </button>
                    )
                })}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-12 flex justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                        <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-500">No logos uploaded for this category yet.</p>
                    </div>
                ) : (
                    filteredItems.map((item, i) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="h-20 w-full flex items-center justify-center mb-3">
                                <img src={item.imageUrl} alt={item.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <h4 className="text-slate-900 dark:text-white font-semibold text-xs text-center truncate w-full">{item.name}</h4>

                            <button
                                onClick={() => handleDelete(item._id)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                title="Delete Logo"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Render Cropper Modal if a file needs cropping */}
            {fileToCrop && (
                <ImageCropper 
                    file={fileToCrop} 
                    aspectRatio={1} // Square by default for logos
                    onCropComplete={handleCropComplete} 
                    onCancel={() => setFileToCrop(null)} 
                />
            )}
        </div>
    );
}
