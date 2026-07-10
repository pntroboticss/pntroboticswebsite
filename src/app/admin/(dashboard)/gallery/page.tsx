"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Trash2, Edit2, Upload, ImageIcon, X, Box, AlertTriangle } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

type GalleryItem = {
    id: string;
    created_at: string;
    title: string;
    image_url: string;
};

export default function AdminGallery() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteItem, setDeleteItem] = useState<{id: string, imageUrl: string} | null>(null);
    
    // Form state
    const [editId, setEditId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState("");

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("gallery")
            .select("*")
            .order("created_at", { ascending: false });
            
        if (!error && data) {
            setItems(data);
        } else if (error) {
            toast.error("Failed to fetch gallery");
            console.error("Error fetching gallery:", error);
        }
        setIsLoading(false);
    };

    const resetForm = () => {
        setEditId(null);
        setTitle("");
        setImageFile(null);
        setCurrentImageUrl("");
        setIsFormOpen(false);
    };

    const handleEdit = (item: GalleryItem) => {
        setEditId(item.id);
        setTitle(item.title || "");
        setCurrentImageUrl(item.image_url || "");
        setImageFile(null);
        setIsFormOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteItem) return;
        
        const toastId = toast.loading("Deleting image...");
        try {
            // Delete image from storage if it exists
            if (deleteItem.imageUrl) {
                const fileName = deleteItem.imageUrl.split('/').pop();
                if (fileName) {
                    await supabase.storage.from("gallery-images").remove([fileName]);
                }
            }

            // Delete from database
            const { error } = await supabase.from("gallery").delete().eq("id", deleteItem.id);
            if (error) throw error;
            
            toast.success("Image deleted successfully", { id: toastId });
            await fetchGallery();
        } catch (error: any) {
            console.error(error);
            toast.error(`Failed to delete: ${error.message}`, { id: toastId });
        } finally {
            setDeleteItem(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading(editId ? "Updating image..." : "Uploading image...");

        try {
            let finalImageUrl = currentImageUrl;

            // Upload new image if selected
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `gallery_${Date.now()}.${fileExt}`;
                
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("gallery-images")
                    .upload(fileName, imageFile, { upsert: true });

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from("gallery-images")
                    .getPublicUrl(uploadData.path);
                
                finalImageUrl = publicUrlData.publicUrl;

                // Cleanup old image if replacing
                if (currentImageUrl && editId) {
                    const oldFileName = currentImageUrl.split('/').pop();
                    if (oldFileName) {
                        await supabase.storage.from("gallery-images").remove([oldFileName]);
                    }
                }
            }
            
            if (!finalImageUrl) {
                toast.error("Please select an image", { id: toastId });
                setIsSubmitting(false);
                return;
            }

            const itemData = {
                title,
                image_url: finalImageUrl,
                category: "general"
            };

            if (editId) {
                const { error } = await supabase.from("gallery").update(itemData).eq("id", editId);
                if (error) throw error;
                toast.success("Image updated successfully", { id: toastId });
            } else {
                const { error } = await supabase.from("gallery").insert([itemData]);
                if (error) throw error;
                toast.success("Image uploaded successfully", { id: toastId });
            }

            resetForm();
            await fetchGallery();
        } catch (error: any) {
            console.error(error);
            toast.error(`Failed to save image: ${error.message}`, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Gallery Manager</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Manage images for the public gallery.</p>
                </div>
                <button 
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Add Image
                </button>
            </div>

            {/* Custom Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteItem && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-500">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Image?</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                                    Are you sure you want to delete this image? This action cannot be undone.
                                </p>
                                <div className="flex w-full gap-3">
                                    <button 
                                        onClick={() => setDeleteItem(null)}
                                        className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={confirmDelete}
                                        className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal Form */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
                        >
                            <button 
                                onClick={resetForm}
                                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                {editId ? "Edit Image" : "Upload New Image"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Image Title (Optional)</label>
                                    <input 
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-shadow"
                                        placeholder="e.g. Robot operating in field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Photo</label>
                                    <div className="flex items-center gap-4">
                                        {(currentImageUrl || imageFile) && (
                                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                                                {imageFile ? (
                                                    <Image src={URL.createObjectURL(imageFile)} alt="Preview" fill sizes="128px" className="object-cover" />
                                                ) : (
                                                    <Image src={currentImageUrl} alt="Preview" fill sizes="128px" className="object-cover" />
                                                )}
                                            </div>
                                        )}
                                        <label className="flex-1 cursor-pointer flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 dark:hover:border-indigo-400 dark:hover:bg-indigo-900/20 transition-all">
                                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                                {imageFile ? imageFile.name : (currentImageUrl ? 'Replace Photo' : 'Select Photo')}
                                            </span>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button 
                                        type="button" 
                                        onClick={resetForm}
                                        className="px-6 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting || (!currentImageUrl && !imageFile)}
                                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-500/20"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                        {editId ? 'Save Changes' : 'Upload Image'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Gallery Grid */}
            {items.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <Box className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Images Found</h3>
                    <p className="text-slate-500 mb-6">Upload some photos to display in the public gallery.</p>
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-600 shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" /> Upload First Photo
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden group shadow-sm">
                            {item.image_url ? (
                                <Image src={item.image_url} alt={item.title || "Gallery image"} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                    <ImageIcon className="w-8 h-8" />
                                </div>
                            )}
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                {item.title && (
                                    <p className="text-white font-medium text-sm truncate mb-2">{item.title}</p>
                                )}
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleEdit(item)}
                                        className="p-2 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-lg backdrop-blur-sm transition-colors flex-1 flex justify-center"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => setDeleteItem({ id: item.id, imageUrl: item.image_url })}
                                        className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition-colors flex-1 flex justify-center"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
