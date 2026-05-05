"use client";

import { useState, useRef } from "react";
import { Upload, Home, FlaskConical, School, CheckCircle2, X } from "lucide-react";
import Image from "next/image";
import ImageCropper from "./ImageCropper";

export default function TestimonialManager({ onSuccess }: { onSuccess?: () => void }) {
    const [name, setName] = useState("");
    const [college, setCollege] = useState("");
    const [quote, setQuote] = useState("");
    const [page, setPage] = useState<"employee" | "lab" | "college" | "kids" | "schools">("employee");
    const [logoUrl, setLogoUrl] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileToCrop, setFileToCrop] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && (file.type.startsWith("image/") || file.type === "image/gif")) handleFileSelect(file);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleFileSelect = (file: File) => {
        // Automatically skip crop for GIFs to preserve animation
        if (file.type === "image/gif") {
            handleCropComplete(file);
        } else {
            setFileToCrop(file);
        }
    };

    const handleCropComplete = (croppedFile: File) => {
        setSelectedFile(croppedFile);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(croppedFile);
        setFileToCrop(null);
    };

    const clearImage = () => {
        setImagePreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !college || !quote) {
            setStatus({ type: "error", msg: "Name, role, and quote are required." });
            return;
        }
        setIsSubmitting(true);
        setStatus(null);
        try {
            let secureUrl = "";

            if (selectedFile) {
                const cloudName = "dycht8a6s";
                const uploadPreset = "pnt_academy_unsigned";
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("upload_preset", uploadPreset);

                // GIFs must go to the video endpoint on Cloudinary for animated support
                const resourceType = selectedFile.type === "image/gif" ? "image" : "image";
                const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
                    method: "POST",
                    body: formData,
                });
                if (!cloudRes.ok) {
                    const err = await cloudRes.json();
                    throw new Error(`Cloudinary upload failed: ${err.error?.message || cloudRes.statusText}`);
                }
                const cloudData = await cloudRes.json();
                secureUrl = cloudData.secure_url;
            }

            const dbRes = await fetch("/api/admin/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, role: college, quote, imageUrl: secureUrl, logoUrl, page }),
            });
            if (!dbRes.ok) {
                const err = await dbRes.json();
                throw new Error(`Save failed: ${err.message}`);
            }

            setStatus({ type: "success", msg: "Testimonial added successfully!" });
            setName(""); setCollege(""); setQuote(""); setPage("employee"); setLogoUrl(""); clearImage();
            onSuccess?.();
        } catch (error: any) {
            setStatus({ type: "error", msg: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">Add New Testimonial</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">Fill in the info and upload a photo or school logo.</p>

            {status && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${status.type === "success" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"}`}>
                    {status.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                    {status.msg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Page Selector */}
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Show on Page</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {([
                            { id: "employee", label: "Employee", icon: Home, desc: "Team Testimonials" },
                            { id: "lab", label: "Robotics Lab", icon: FlaskConical, desc: "College Lab setup page" },
                            { id: "college", label: "College Trainings", icon: School, desc: "College programs" },
                            { id: "kids", label: "Courses for Kids", icon: CheckCircle2, desc: "1-to-1 kids course page" },
                            { id: "schools", label: "School Trainings", icon: School, desc: "Trainings for Schools page (Teacher Testimonials)" },
                        ] as const).map((opt) => (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => setPage(opt.id as any)}
                                className={`flex flex-col gap-2 p-3 rounded-2xl border-2 text-left transition-all ${page === opt.id ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"}`}
                            >
                                <div className={`p-1.5 w-max rounded-xl ${page === opt.id ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                                    <opt.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className={`text-[13px] font-bold leading-tight ${page === opt.id ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>{opt.label}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Form fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                            <input type="text" required value={name} onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                                placeholder="e.g. Aman Sharma" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">College / School / Role</label>
                            <input type="text" required value={college} onChange={e => setCollege(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                                placeholder="e.g. DPS School / Student" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Testimonial Quote</label>
                            <textarea required rows={5} value={quote} onChange={e => setQuote(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium resize-none"
                                placeholder="What did they have to say?" />
                        </div>
                        
                        {/* URL Logo Input Alternative */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                School / Organization Logo URL (Optional)
                            </label>
                            <input type="url" value={logoUrl} onChange={e => setLogoUrl(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm font-medium"
                                placeholder="Paste logo image link here..." />
                            <p className="text-[10px] text-slate-400 mt-1">
                                For kids' privacy, you can just paste their school logo URL here and leave the main photo blank!
                            </p>
                        </div>
                    </div>

                    {/* Right: Image upload */}
                    <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Main Photo / GIF (Optional)</label>
                        <div
                            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                            onClick={() => !imagePreview && fileInputRef.current?.click()}
                            className={`flex-1 min-h-[240px] relative rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center ${imagePreview ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" : isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" : "border-slate-300 dark:border-slate-700 hover:border-blue-400 cursor-pointer"}`}
                        >
                            <input type="file" ref={fileInputRef} onChange={handleFileInput}
                                accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" />

                            {imagePreview ? (
                                <div className="absolute inset-0 p-2">
                                    <div className="relative w-full h-full rounded-xl overflow-hidden group">
                                        {/* Use <img> for GIFs to preserve animation */}
                                        {selectedFile?.type === "image/gif" ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" onClick={e => { e.stopPropagation(); clearImage(); }}
                                                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all shadow-lg">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
                                        <Upload className="w-7 h-7" />
                                    </div>
                                    <p className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-1">Drag & drop or click to upload</p>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-2">Leave blank to just show Logo</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button type="submit" disabled={isSubmitting || !name || !college || !quote}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        {isSubmitting ? "Uploading..." : "Add Testimonial"}
                    </button>
                </div>
            </form>

            {/* Render Cropper Modal if a file needs cropping */}
            {fileToCrop && (
                <ImageCropper
                    file={fileToCrop}
                    aspectRatio={1} // Square crop for testimonials
                    onCropComplete={handleCropComplete}
                    onCancel={() => {
                        setFileToCrop(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                />
            )}
        </div>
    );
}
