"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, CheckCircle2, Lightbulb, Upload, FileText, AlertCircle } from "lucide-react";

interface CustomProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CustomProjectModal({ isOpen, onClose }: CustomProjectModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showFallbackPopup, setShowFallbackPopup] = useState(false);
    
    // File states
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        entityType: "",
        stageOfDevelopment: "",
        intendedUse: "",
        industryType: "",
        projectType: "",
        targetAudience: "",
        useCase: "",
        requirements: "",
        quantity: "",
        budget: "",
        timeFrame: "",
        ndaRequired: "No"
    });

    const resetForm = () => {
        setFormData({
            name: "", email: "", entityType: "", stageOfDevelopment: "", intendedUse: "",
            industryType: "", projectType: "", targetAudience: "", useCase: "", requirements: "", quantity: "", budget: "",
            timeFrame: "", ndaRequired: "No"
        });
        setFile(null);
        setFileError("");
        setShowFallbackPopup(false);
        setIsSuccess(false);
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileError("");
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            
            // Enforce 10MB limit
            if (selectedFile.size > 10 * 1024 * 1024) {
                setFileError("File is too large. Maximum size is 10MB.");
                setFile(null);
            } else {
                setFile(selectedFile);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => submitData.append(key, value));
            
            if (file) {
                submitData.append("document", file);
            }

            const res = await fetch("/api/custom-project", {
                method: "POST",
                body: submitData
            });

            const data = await res.json();

            if (res.ok) {
                if (data.uploadFailed) {
                    // Show fallback popup if text saved but file upload failed
                    setShowFallbackPopup(true);
                } else {
                    setIsSuccess(true);
                    setTimeout(() => {
                        resetForm();
                        onClose();
                    }, 3000);
                }
            } else {
                console.error("Failed to submit custom project request");
            }
        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const inputClasses = "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400";
    const labelClasses = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
                    />

                    {/* Modal */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden my-auto"
                    >
                        {/* Header (Fixed) */}
                        <div className="relative z-10 border-b border-slate-100 dark:border-slate-800 px-6 py-5 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                                    <Lightbulb size={24} className="animate-pulse" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Project Information</h3>
                            </div>
                            <button 
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors disabled:opacity-50"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content (Scrollable) */}
                        <div className="relative p-6 md:p-8 overflow-y-auto custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {showFallbackPopup ? (
                                    <motion.div 
                                        key="fallback"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex flex-col items-center justify-center text-center py-12 px-4"
                                    >
                                        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6">
                                            <AlertCircle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Almost Done!</h3>
                                        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
                                            We've successfully received your project details, but our storage system couldn't attach your document right now.
                                        </p>
                                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md mb-8">
                                            <p className="font-semibold text-slate-900 dark:text-white mb-2">Please email your document to:</p>
                                            <a href="mailto:contact@pntsolutions.in" className="text-blue-600 dark:text-blue-400 font-bold text-lg hover:underline">
                                                contact@pntsolutions.in
                                            </a>
                                            <p className="text-sm text-slate-500 mt-2">Include your name ({formData.name}) in the email so we can link it to your request.</p>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                resetForm();
                                                onClose();
                                            }}
                                            className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                                        >
                                            Got it, Close
                                        </button>
                                    </motion.div>
                                ) : isSuccess ? (
                                    <motion.div 
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex flex-col items-center justify-center text-center py-20"
                                    >
                                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                                            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Request Submitted!</h3>
                                        <p className="text-slate-600 dark:text-slate-400">We've received your project details and will be in touch shortly.</p>
                                    </motion.div>
                                ) : (
                                    <motion.form 
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-8"
                                    >
                                        {/* SECTION 1: Contact Basics */}
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">1. Contact & Entity</h4>
                                            <div className="grid md:grid-cols-3 gap-6">
                                                <div>
                                                    <label className={labelClasses}>Name *</label>
                                                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClasses} placeholder="John Doe" />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Email *</label>
                                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClasses} placeholder="john@example.com" />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Type of Entity *</label>
                                                    <select name="entityType" required value={formData.entityType} onChange={handleChange} className={inputClasses}>
                                                        <option value="" disabled>Please Select</option>
                                                        <option value="Private">Private</option>
                                                        <option value="Government">Government</option>
                                                        <option value="Individual">Individual</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 2: Project Overview */}
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">2. Project Overview</h4>
                                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                                <div>
                                                    <label className={labelClasses}>Stage of Development *</label>
                                                    <select name="stageOfDevelopment" required value={formData.stageOfDevelopment} onChange={handleChange} className={inputClasses}>
                                                        <option value="" disabled>Please Select</option>
                                                        <option value="Idea/Concept">Idea/Concept</option>
                                                        <option value="Prototyping">Prototyping</option>
                                                        <option value="Ready for Production">Ready for Production</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Intended Use *</label>
                                                    <select name="intendedUse" required value={formData.intendedUse} onChange={handleChange} className={inputClasses}>
                                                        <option value="" disabled>Please Select</option>
                                                        <option value="Sell the robot">Sell the robot</option>
                                                        <option value="Own business use">Own business use</option>
                                                        <option value="Personal project">Personal project</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <div className="grid md:grid-cols-3 gap-6 mb-6">
                                                <div>
                                                    <label className={labelClasses}>Type of Industry *</label>
                                                    <input type="text" name="industryType" required value={formData.industryType} onChange={handleChange} className={inputClasses} placeholder="e.g. Healthcare, Manufacturing..." />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Type of Project *</label>
                                                    <input type="text" name="projectType" required value={formData.projectType} onChange={handleChange} className={inputClasses} placeholder="e.g. Autonomous Arm..." />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Target Audience *</label>
                                                    <input type="text" name="targetAudience" required value={formData.targetAudience} onChange={handleChange} className={inputClasses} placeholder="Who will use this?" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={labelClasses}>Use Case Description *</label>
                                                <textarea rows={3} name="useCase" required value={formData.useCase} onChange={handleChange} className={`${inputClasses} resize-none`} placeholder="Tell us about what this custom robot would be used for!" />
                                            </div>
                                        </div>

                                        {/* SECTION 3: Robot Requirements */}
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">3. Robot Requirements</h4>
                                            <div className="mb-6">
                                                <label className={labelClasses}>Detailed Requirements *</label>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                                    Provide details about the design & purpose. Examples: Dimensions (Min/Max), Weight Restrictions (lbs), Operating Environment (Indoor/Outdoor), Control Method (Autonomous/Direct Control), Run Time, Speed, Camera.
                                                </p>
                                                <textarea rows={5} name="requirements" required value={formData.requirements} onChange={handleChange} className={`${inputClasses} resize-none`} placeholder="Enter detailed robot specifications..." />
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-6">
                                                <div>
                                                    <label className={labelClasses}>Estimated Quantity *</label>
                                                    <input type="number" min="1" name="quantity" required value={formData.quantity} onChange={handleChange} className={inputClasses} placeholder="e.g. 5" />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Estimated Budget (per Robot) *</label>
                                                    <input type="text" name="budget" required value={formData.budget} onChange={handleChange} className={inputClasses} placeholder="e.g. $5000" />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Time Frame for Delivery *</label>
                                                    <input type="text" name="timeFrame" required value={formData.timeFrame} onChange={handleChange} className={inputClasses} placeholder="e.g. 3 Months" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* SECTION 4: Additional Information */}
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-4">4. Additional Information</h4>
                                            
                                            <div className="grid md:grid-cols-2 gap-6 items-start">
                                                <div>
                                                    <label className={labelClasses}>Additional Documents (Max 10MB)</label>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                                        Attach business plans, sketches, etc.
                                                    </p>
                                                    
                                                    {!file ? (
                                                        <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Choose file or drag & drop</span>
                                                            </div>
                                                            <input 
                                                                type="file" 
                                                                className="hidden" 
                                                                onChange={handleFileChange}
                                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                            />
                                                        </label>
                                                    ) : (
                                                        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                                                <div className="truncate">
                                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{file.name}</p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                                </div>
                                                            </div>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => setFile(null)}
                                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors flex-shrink-0"
                                                            >
                                                                <X size={20} />
                                                            </button>
                                                        </div>
                                                    )}
                                                    
                                                    {fileError && (
                                                        <p className="text-sm text-red-500 mt-2 font-medium flex items-center gap-1">
                                                            <AlertCircle className="w-4 h-4" /> {fileError}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className={labelClasses}>NDA Required? *</label>
                                                    <div className="flex gap-4 mt-2">
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input type="radio" name="ndaRequired" value="Yes" checked={formData.ndaRequired === "Yes"} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                                            <span className="text-slate-900 dark:text-white font-medium">Yes</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
                                                            <input type="radio" name="ndaRequired" value="No" checked={formData.ndaRequired === "No"} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                                                            <span className="text-slate-900 dark:text-white font-medium">No</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Footer */}
                                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                            <button 
                                                type="submit" 
                                                disabled={isSubmitting || !!fileError}
                                                className="w-full relative flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-500 hover:to-purple-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-blue-500/20"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Submitting Request...
                                                    </>
                                                ) : (
                                                    <>
                                                        Submit Project Details
                                                        <Send className="w-5 h-5" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
