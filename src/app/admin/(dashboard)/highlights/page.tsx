"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload, RefreshCw } from "lucide-react";
import Image from "next/image";

type HighlightMedia = {
    id: string;
    section: 'hero_videos' | 'machine_images';
    slot_index: number;
    media_url: string;
};

export default function AdminHighlights() {
    const [mediaItems, setMediaItems] = useState<HighlightMedia[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);

    useEffect(() => {
        fetchHighlights();
    }, []);

    const fetchHighlights = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.from("site_highlights").select("*").order("slot_index", { ascending: true });
        if (!error && data) {
            setMediaItems(data);
        }
        setIsLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: 'hero_videos' | 'machine_images', slot_index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (section === 'hero_videos' && !file.type.startsWith('video/')) {
            alert("Please select a valid video file.");
            return;
        }
        if (section === 'machine_images' && !file.type.startsWith('image/')) {
            alert("Please select a valid image file.");
            return;
        }

        const slotId = `${section}-${slot_index}`;
        setUploadingSlot(slotId);

        try {
            // Upload to storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${section}_${slot_index}_${Date.now()}.${fileExt}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("homepage_media")
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: publicUrlData } = supabase.storage
                .from("homepage_media")
                .getPublicUrl(uploadData.path);
            
            const newUrl = publicUrlData.publicUrl;

            // Delete old file from storage if replacing (Optional cleanup step)
            const oldItem = mediaItems.find(m => m.section === section && m.slot_index === slot_index);
            if (oldItem) {
                const oldFileName = oldItem.media_url.split('/').pop();
                if (oldFileName) {
                    await supabase.storage.from("homepage_media").remove([oldFileName]);
                }
            }

            // Upsert in database
            const { error: dbError } = await supabase.from("site_highlights").upsert({
                section,
                slot_index,
                media_url: newUrl
            }, { onConflict: 'section, slot_index' });

            if (dbError) throw dbError;

            await fetchHighlights();
        } catch (err: any) {
            console.error(err);
            alert(`Upload failed: ${err.message}`);
        } finally {
            setUploadingSlot(null);
        }
    };

    const renderSlots = (section: 'hero_videos' | 'machine_images', title: string, subtitle: string, count: number) => {
        return (
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
                <p className="text-slate-500 mb-6">{subtitle}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: count }).map((_, i) => {
                        const slotIndex = i + 1;
                        const item = mediaItems.find(m => m.section === section && m.slot_index === slotIndex);
                        const isUploading = uploadingSlot === `${section}-${slotIndex}`;

                        return (
                            <div key={slotIndex} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex flex-col">
                                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                                    <h3 className="font-semibold text-slate-700 dark:text-slate-300">Slot {slotIndex}</h3>
                                    {item && (
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full font-medium">
                                            Active
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex-1 p-4 flex flex-col items-center justify-center min-h-[200px] relative">
                                    {isUploading ? (
                                        <div className="flex flex-col items-center justify-center text-blue-500">
                                            <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                            <span className="text-sm font-medium">Uploading...</span>
                                        </div>
                                    ) : item ? (
                                        <div className="w-full h-full flex flex-col items-center gap-4">
                                            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                                                {section === 'hero_videos' ? (
                                                    <video src={item.media_url} className="w-full h-full object-cover" controls preload="metadata" />
                                                ) : (
                                                    <Image src={item.media_url} alt={`Slot ${slotIndex}`} fill className="object-cover" />
                                                )}
                                            </div>
                                            <label className="cursor-pointer w-full flex flex-col items-center justify-center gap-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors font-medium text-sm">
                                                <div className="flex items-center gap-2">
                                                    <RefreshCw className="w-4 h-4" />
                                                    Replace {section === 'hero_videos' ? 'Video' : 'Image'}
                                                </div>
                                                <span className="text-xs text-slate-400 dark:text-slate-400 font-normal">
                                                    (Max size: 50MB)
                                                </span>
                                                <input 
                                                    type="file" 
                                                    accept={section === 'hero_videos' ? 'video/*' : 'image/*'} 
                                                    className="hidden" 
                                                    onChange={(e) => handleFileUpload(e, section, slotIndex)}
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full min-h-[150px] border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group">
                                            <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-500 transition-colors">
                                                Upload {section === 'hero_videos' ? 'Video' : 'Image'}
                                            </span>
                                            <span className="text-xs text-slate-400 mt-1">
                                                (Max size: 50MB)
                                            </span>
                                            <input 
                                                type="file" 
                                                accept={section === 'hero_videos' ? 'video/*' : 'image/*'} 
                                                className="hidden" 
                                                onChange={(e) => handleFileUpload(e, section, slotIndex)}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Update Highlights</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Manage the main media playing on the homepage.</p>
            </div>

            {renderSlots('hero_videos', 'Hero Section Videos', 'These 6 videos play consecutively at the very top of the homepage.', 6)}
            {renderSlots('machine_images', 'Machines For Tomorrow Images', 'These 6 images cycle in the 3D carousel.', 6)}
        </div>
    );
}
