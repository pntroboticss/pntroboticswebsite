"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2, Users } from "lucide-react";
import ImageCropper from "@/components/admin/ImageCropper";

export default function AdminAboutPhotos() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [fileToCrop, setFileToCrop] = useState<File | null>(null);
    const [caption, setCaption] = useState("");

    useEffect(() => { fetchPhotos(); }, []);

    const fetchPhotos = async () => {
        try {
            const res = await fetch("/api/admin/about");
            setItems(await res.json());
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    const getBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

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
        if (!file) return;
        setIsUploading(true);
        try {
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

            const res = await fetch("/api/admin/about", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ caption, imageUrl: secureUrl }),
            });
            if (res.ok) { setFile(null); setCaption(""); await fetchPhotos(); }
        } catch (e) { console.error(e); }
        finally { setIsUploading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this photo?")) return;
        await fetch(`/api/admin/about?id=${id}`, { method: "DELETE" });
        setItems(items.filter((i) => i._id !== id));
    };

    return (
        <div className="space-y-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-500 tracking-tight">
                    About Section Photos
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-lg">
                    Upload team & campus photos. They appear in the image slider on the About PNT Academy section of the homepage.
                </p>
            </header>

            {/* Upload Form */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm"
            >
                <form onSubmit={handleUpload} className="space-y-5">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <Plus className="w-5 h-5 text-purple-500" /> Add Photo
                    </h3>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Caption (optional)</label>
                        <input
                            type="text"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="e.g. Our team at the Robotics Lab"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Image File</label>
                        <input
                            type="file" required={!file} accept="image/*"
                            onChange={(e) => handleFileSelect(e.target.files?.[0])}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-purple-50 dark:file:bg-purple-900/30 file:text-purple-700 dark:file:text-purple-400 hover:file:bg-purple-100 transition-colors"
                        />
                        {file && <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-semibold">✓ Photo prepared</p>}
                    </div>
                    <button
                        type="submit" disabled={isUploading || !file}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2"
                    >
                        {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : "Upload & Publish to Homepage"}
                    </button>
                </form>
            </motion.div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
                ) : items.length === 0 ? (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                        <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-500">No photos uploaded yet. Add your team photos above!</p>
                    </div>
                ) : (
                    items.map((item, i) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm"
                        >
                            <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800">
                                <img src={item.imageUrl} alt={item.caption || "About photo"} className="w-full h-full object-cover" />
                            </div>
                            {item.caption && (
                                <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{item.caption}</p>
                                </div>
                            )}
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all shadow-lg"
                                title="Delete Photo"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))
                )}
            </div>

            {fileToCrop && (
                <ImageCropper 
                    file={fileToCrop} 
                    aspectRatio={16 / 9} // Wide aspect ratio for about photos
                    onCropComplete={handleCropComplete} 
                    onCancel={() => setFileToCrop(null)} 
                />
            )}
        </div>
    );
}
