"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2, Video, Upload, RefreshCw, HardDrive } from "lucide-react";

function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

interface VideoItem {
    _id: string;      // MongoDB ID
    filename: string; // Original File Name
    url: string;      // Cloudinary Secure URL
    size: number;     // File Size in Bytes
    publicId: string; // Cloudinary Public ID
    order: number;
    startTime: number;
    endTime: number;
    createdAt: string;
}

export default function AdminVideos() {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/videos");
            const data = await res.json();
            setVideos(data);
        } catch (error) {
            console.error("Failed to fetch videos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size limit ~20MB for direct Cloudinary unsigned upload
        if (file.size > 50 * 1024 * 1024) {
            alert("File is too large! Please keep videos under 50MB.");
            return;
        }

        setIsUploading(true);
        setUploadProgress(10); // Start progress

        try {
            // 1. Upload to Cloudinary using unsigned preset (resource_type: "video")
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "pnt_academy_unsigned");

            // We do a manual fetch for Cloudinary upload to show raw progress via standard fetch isn't possible,
            // but we can fake progress or just wait. For production, XHR is better for real progress bars.
            setUploadProgress(40);
            
            const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dycht8a6s/video/upload", {
                method: "POST",
                body: formData,
            });

            if (!cloudinaryRes.ok) {
                const err = await cloudinaryRes.text();
                throw new Error(`Cloudinary Auth/Network fail: ${err}`);
            }

            setUploadProgress(80);
            const cloudinaryData = await cloudinaryRes.json();
            
            // 2. Save secure_url to our MongoDB Database
            const res = await fetch("/api/admin/videos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: file.name,
                    url: cloudinaryData.secure_url,
                    size: cloudinaryData.bytes || file.size,
                    publicId: cloudinaryData.public_id,
                }),
            });

            if (res.ok) {
                setUploadProgress(100);
                await fetchVideos(); // Refresh the list
            } else {
                throw new Error("Failed to save to database");
            }
        } catch (error: any) {
            console.error("Upload error:", error);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDelete = async (id: string, filename: string) => {
        if (!confirm(`Are you sure you want to delete "${filename}"? This will be removed from Cloudinary and the Schools Training page immediately.`)) return;

        try {
            const res = await fetch(`/api/admin/videos?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setVideos(videos.filter((v) => v._id !== id));
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const moveVideo = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === videos.length - 1) return;

        const newVideos = [...videos];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        
        // Swap elements
        const temp = newVideos[index];
        newVideos[index] = newVideos[swapIndex];
        newVideos[swapIndex] = temp;

        // Re-assign order based on array index
        const bulkItems = newVideos.map((v, i) => ({ ...v, order: i }));
        setVideos(bulkItems);

        // Save order to DB
        try {
            await fetch("/api/admin/videos", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reorder: true,
                    items: bulkItems.map(v => ({ _id: v._id, order: v.order }))
                })
            });
        } catch (error) {
            console.error("Reorder failed:", error);
            // Optionally could revert state here if fetch fails
        }
    };

    const handleTrimSave = async (id: string, start: number, end: number) => {
        try {
            const res = await fetch("/api/admin/videos", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    _id: id,
                    startTime: start,
                    endTime: end
                })
            });
            if (res.ok) {
                alert("Trim settings saved!");
            }
        } catch (error) {
            console.error("Trim update failed", error);
        }
    };

    return (
        <div className="space-y-6">
            <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Schools Training Videos</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-lg">
                        Manage hero background videos for the Training for Schools page. Videos play sequentially with crossfade transitions. Uploading here hosts the video on Cloudinary for blazing fast, globally distributed playback.
                    </p>
                </div>
                <button
                    onClick={fetchVideos}
                    className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </header>

            {/* Upload Module */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm"
            >
                <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                    <Upload className="w-5 h-5 text-blue-500" /> Upload New Video
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center relative overflow-hidden">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={handleUpload}
                        disabled={isUploading}
                        className="flex-1 p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 transition-colors"
                    />
                    {isUploading && (
                        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-semibold absolute right-4">
                            <Loader2 className="w-4 h-4 animate-spin" /> Uploading to Cloud... {uploadProgress}%
                        </div>
                    )}
                </div>
                {/* Progress bar line */}
                {isUploading && (
                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
                        <motion.div 
                            className="h-full bg-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                )}
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
                    Supported: .mp4, .webm, .mov • Max size ~50MB per video.
                </p>
            </motion.div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-12 flex justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : videos.length === 0 ? (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                        <Video className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium text-lg">No videos uploaded yet</p>
                        <p className="text-sm text-slate-400 mt-1">Upload a video to see it appear on the Schools page automatically.</p>
                    </div>
                ) : (
                    videos.map((video, i) => (
                        <motion.div
                            key={video._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden shadow-sm flex flex-col"
                        >
                            <div className="aspect-video w-full bg-slate-900 relative">
                                {/* We add controls to the admin panel so they can easily watch and verify the whole thing */}
                                <video
                                    src={video.url}
                                    className="w-full h-full object-cover"
                                    muted
                                    controls
                                    playsInline
                                    preload="metadata"
                                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(()=>{})}
                                    onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); }}
                                />
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate" title={video.filename}>
                                    {video.filename}
                                </h4>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium pb-3 border-b border-slate-100 dark:border-white/5 whitespace-nowrap">
                                    <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> {formatBytes(video.size)}</span>
                                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="mt-3 flex flex-col gap-2 relative z-20">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Trim Video (Seconds)</label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col flex-1">
                                            <span className="text-[10px] text-slate-500 mb-1">Start Time</span>
                                            <input 
                                                type="number" 
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
                                                value={video.startTime}
                                                onChange={(e) => {
                                                    const newVideos = [...videos];
                                                    newVideos[i].startTime = Number(e.target.value);
                                                    setVideos(newVideos);
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <span className="text-[10px] text-slate-500 mb-1">End Time</span>
                                            <input 
                                                type="number" 
                                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
                                                value={video.endTime}
                                                onChange={(e) => {
                                                    const newVideos = [...videos];
                                                    newVideos[i].endTime = Number(e.target.value);
                                                    setVideos(newVideos);
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col justify-end h-full">
                                            <button 
                                                onClick={() => handleTrimSave(video._id, video.startTime, video.endTime)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors mt-auto mb-[2px]"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-tight">If End Time is 0, it plays to the end. The Schools page will only play within this window.</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(video._id, video.filename)}
                                className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all shadow-lg z-30"
                                title="Delete Video"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            
                            <div className="absolute top-3 left-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all z-30">
                                <button
                                    onClick={() => moveVideo(i, 'up')}
                                    disabled={i === 0}
                                    className="p-1.5 bg-slate-800/80 hover:bg-slate-700 backdrop-blur disabled:opacity-30 disabled:hover:bg-slate-800/80 text-white rounded-md transition-all shadow-lg"
                                    title="Move Up"
                                >
                                    ↑
                                </button>
                                <button
                                    onClick={() => moveVideo(i, 'down')}
                                    disabled={i === videos.length - 1}
                                    className="p-1.5 bg-slate-800/80 hover:bg-slate-700 backdrop-blur disabled:opacity-30 disabled:hover:bg-slate-800/80 text-white rounded-md transition-all shadow-lg"
                                    title="Move Down"
                                >
                                    ↓
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
