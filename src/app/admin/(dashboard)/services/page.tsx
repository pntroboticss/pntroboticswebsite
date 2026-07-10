"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Trash2, Edit2, Upload, ImageIcon, X, Box } from "lucide-react";
import Image from "next/image";

type Service = {
    id: string;
    created_at: string;
    title: string;
    description: string;
    image_url: string;
    is_active: boolean;
    display_order: number;
};

export default function AdminServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state
    const [editId, setEditId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState("");

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("services")
            .select("*")
            .order("created_at", { ascending: false });
            
        if (!error && data) {
            setServices(data);
        } else if (error) {
            console.error("Error fetching services:", error);
        }
        setIsLoading(false);
    };

    const resetForm = () => {
        setEditId(null);
        setTitle("");
        setDescription("");
        setImageFile(null);
        setCurrentImageUrl("");
        setIsFormOpen(false);
    };

    const handleEdit = (service: Service) => {
        setEditId(service.id);
        setTitle(service.title);
        setDescription(service.description);
        setCurrentImageUrl(service.image_url || "");
        setImageFile(null);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!confirm("Are you sure you want to delete this service?")) return;

        try {
            // Delete image from storage if it exists
            if (imageUrl) {
                const fileName = imageUrl.split('/').pop();
                if (fileName) {
                    await supabase.storage.from("service-images").remove([fileName]);
                }
            }

            // Delete from database
            const { error } = await supabase.from("services").delete().eq("id", id);
            if (error) throw error;
            
            await fetchServices();
        } catch (error: any) {
            console.error(error);
            alert(`Failed to delete: ${error.message}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let finalImageUrl = currentImageUrl;

            // Upload new image if selected
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `service_${Date.now()}.${fileExt}`;
                
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("service-images")
                    .upload(fileName, imageFile, { upsert: true });

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from("service-images")
                    .getPublicUrl(uploadData.path);
                
                finalImageUrl = publicUrlData.publicUrl;

                // Cleanup old image if replacing
                if (currentImageUrl && editId) {
                    const oldFileName = currentImageUrl.split('/').pop();
                    if (oldFileName) {
                        await supabase.storage.from("service-images").remove([oldFileName]);
                    }
                }
            }

            const serviceData = {
                title,
                description,
                image_url: finalImageUrl
            };

            if (editId) {
                const { error } = await supabase.from("services").update(serviceData).eq("id", editId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from("services").insert([serviceData]);
                if (error) throw error;
            }

            resetForm();
            await fetchServices();
        } catch (error: any) {
            console.error(error);
            alert(`Failed to save service: ${error.message}`);
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
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Service Portfolio</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Manage services.</p>
                </div>
                <button 
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                >
                    <Plus className="w-5 h-5" />
                    New Service
                </button>
            </div>

            {/* Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button 
                            onClick={resetForm}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                            {editId ? "Edit Service" : "Add New Service"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Service Title</label>
                                <input 
                                    required
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                                <textarea 
                                    required
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Service Image</label>
                                <div className="flex items-center gap-4">
                                    {(currentImageUrl || imageFile) && (
                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                                            {imageFile ? (
                                                <Image src={URL.createObjectURL(imageFile)} alt="Preview" fill sizes="96px" className="object-cover" />
                                            ) : (
                                                <Image src={currentImageUrl} alt="Preview" fill sizes="96px" className="object-cover" />
                                            )}
                                        </div>
                                    )}
                                    <label className="flex-1 cursor-pointer flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
                                        <Upload className="w-6 h-6 text-slate-400 mb-2" />
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            {imageFile ? imageFile.name : (currentImageUrl ? 'Replace Image' : 'Upload Image')}
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
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-500/20"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                    {editId ? 'Save Changes' : 'Create Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Services Grid */}
            {services.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <Box className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Services Found</h3>
                    <p className="text-slate-500 mb-6">You haven't added any services to the database yet.</p>
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-600 shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add First Service
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group">
                            <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0">
                                {service.image_url ? (
                                    <Image src={service.image_url} alt={service.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleEdit(service)}
                                        className="p-2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg shadow-lg backdrop-blur-sm transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(service.id, service.image_url)}
                                        className="p-2 bg-white/90 dark:bg-slate-800/90 hover:bg-red-50 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg shadow-lg backdrop-blur-sm transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{service.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
