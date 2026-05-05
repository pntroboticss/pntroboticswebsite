"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2, Image as ImageIcon, GraduationCap } from "lucide-react";
import ImageCropper from "@/components/admin/ImageCropper";

export default function AdminSchools() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // Form State
    const [file, setFile] = useState<File | null>(null);
    const [fileToCrop, setFileToCrop] = useState<File | null>(null);
    const [name, setName] = useState("");

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const res = await fetch("/api/admin/schools");
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
        if (!file || !name) return;
        setIsUploading(true);

        try {
            // 1. Upload to Cloudinary using unsigned preset
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

            // 2. Save directly to MongoDB API
            const res = await fetch("/api/admin/schools", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    name,
                    imageUrl: secureUrl,
                }),
            });

            if (res.ok) {
                setFile(null);
                setName("");
                await fetchSchools();
            } else {
                console.error("Failed to post school payload");
            }
            setIsUploading(false);
        } catch (error) {
            console.error("Upload Error", error);
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this school partner?")) return;

        try {
            const res = await fetch(`/api/admin/schools?id=${id}`, { method: "DELETE" });
            if (res.ok) {
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
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Partner Schools Network</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-lg">
                        Manage the school logos appearing in the "Trusted by Innovative Schools" section globally.
                    </p>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-8"
            >
                <form onSubmit={handleUpload} className="flex-1 space-y-5">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <Plus className="w-5 h-5 text-purple-500" /> Register Partner Logo
                    </h3>

                    <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">School/Institution Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Delhi Public School"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Logo Image (Transparent PNG recommended)</label>
                        <input
                            type="file"
                            required={!file}
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e.target.files?.[0])}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-purple-50 dark:file:bg-purple-900/30 file:text-purple-700 dark:file:text-purple-400 hover:file:bg-purple-100 dark:hover:file:bg-purple-900/50 transition-colors"
                        />
                        {file && <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-semibold">✓ Logo prepared</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isUploading || !file}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.3)] disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                        {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : 'Publish Logo to Network'}
                    </button>
                </form>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-12 flex justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                        <GraduationCap className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-500">No partner logos uploaded yet.</p>
                    </div>
                ) : (
                    items.map((item, i) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm flex flex-col items-center p-4 hover:shadow-md transition-all"
                        >
                            <div className="w-24 h-24 mb-3 relative flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-full p-2 border border-slate-100 dark:border-slate-700">
                                <img src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-contain dark:invert transition-all" />
                            </div>
                            <h4 className="text-slate-700 dark:text-slate-200 font-medium text-xs text-center line-clamp-2 w-full">{item.name}</h4>

                            <button
                                onClick={() => handleDelete(item._id)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all shadow-md"
                                title="Remove Partner"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </motion.div>
                    ))
                )}
            </div>

            {fileToCrop && (
                <ImageCropper 
                    file={fileToCrop} 
                    aspectRatio={1} // Square is usually safe for logos padding
                    onCropComplete={handleCropComplete} 
                    onCancel={() => setFileToCrop(null)} 
                />
            )}
        </div>
    );
}
