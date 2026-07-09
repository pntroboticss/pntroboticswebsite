"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle2, Lightbulb, Upload, FileText, AlertCircle, X } from "lucide-react";
import Link from "next/link";

export default function CustomProjectForm() {
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
        ndaRequired: "No",
        _honeypot: ""
    });

    const resetForm = () => {
        setFormData({
            name: "", email: "", entityType: "", stageOfDevelopment: "", intendedUse: "",
            industryType: "", projectType: "", targetAudience: "", useCase: "", requirements: "", quantity: "", budget: "",
            timeFrame: "", ndaRequired: "No", _honeypot: ""
        });
        setFile(null);
        setFileError("");
        setShowFallbackPopup(false);
        setIsSuccess(false);
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
                    setShowFallbackPopup(true);
                } else {
                    setIsSuccess(true);
                    // Instead of closing, just leave success state
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

    const inputClasses = "w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400";
    const labelClasses = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2";

    return (
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="relative border-b border-slate-100 dark:border-slate-800 px-8 py-6 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                        <Lightbulb size={28} className="animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Custom Project Details</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Tell us exactly what you need built.</p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative overflow-hidden bg-white dark:bg-slate-900 p-8 md:p-12">
                <AnimatePresence mode="wait">
                    {showFallbackPopup ? (
                        <motion.div 
                            key="fallback"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col items-center justify-center text-center py-12"
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
                                onClick={resetForm}
                                className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                            >
                                Submit Another Request
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
                            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Request Submitted!</h3>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md">
                                Thank you for providing your project details. Our engineering team will review your requirements and get in touch with you shortly.
                            </p>
                            <div className="flex gap-4">
                                <Link 
                                    href="/"
                                    className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Back to Home
                                </Link>
                                <button 
                                    onClick={resetForm}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                                >
                                    Submit Another
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onSubmit={handleSubmit}
                            className="space-y-12"
                        >
                            {/* Honeypot Field */}
                            <div className="hidden" aria-hidden="true">
                                <label htmlFor="cp_honeypot">Leave this field empty</label>
                                <input
                                    type="text"
                                    id="cp_honeypot"
                                    name="_honeypot"
                                    value={formData._honeypot}
                                    onChange={handleChange}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>

                            {/* SECTION 1: Contact Basics */}
                            <div>
                                <h4 className="text-xl font-black text-slate-900 dark:text-white border-b-2 border-slate-100 dark:border-slate-800 pb-4 mb-6">1. Contact & Entity</h4>
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
                                <h4 className="text-xl font-black text-slate-900 dark:text-white border-b-2 border-slate-100 dark:border-slate-800 pb-4 mb-6">2. Project Overview</h4>
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
                                            <option value="Sell the project">Sell the project</option>
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
                                    <textarea rows={4} name="useCase" required value={formData.useCase} onChange={handleChange} className={`${inputClasses} resize-none`} placeholder="Tell us about what this custom project would be used for in detail." />
                                </div>
                            </div>

                            {/* SECTION 3: Project Requirements */}
                            <div>
                                <h4 className="text-xl font-black text-slate-900 dark:text-white border-b-2 border-slate-100 dark:border-slate-800 pb-4 mb-6">3. Project Requirements</h4>
                                <div className="mb-6">
                                    <label className={labelClasses}>Detailed Requirements *</label>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                                        Provide details about the design & purpose. Examples: Dimensions (Min/Max), Weight Restrictions (lbs), Operating Environment (Indoor/Outdoor), Control Method (Autonomous/Direct Control), Run Time, Speed, Camera.
                                    </p>
                                    <textarea rows={6} name="requirements" required value={formData.requirements} onChange={handleChange} className={`${inputClasses} resize-none`} placeholder="Enter detailed project specifications..." />
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className={labelClasses}>Estimated Quantity *</label>
                                        <input type="number" min="1" name="quantity" required value={formData.quantity} onChange={handleChange} className={inputClasses} placeholder="e.g. 5" />
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Estimated Budget (per Project) *</label>
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
                                <h4 className="text-xl font-black text-slate-900 dark:text-white border-b-2 border-slate-100 dark:border-slate-800 pb-4 mb-6">4. Additional Information</h4>
                                
                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                    <div>
                                        <label className={labelClasses}>Additional Documents</label>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                                            Attach business plans, sketches, etc. <br/>
                                            <span className="font-medium text-slate-600 dark:text-slate-300">Max size: 10MB. Allowed: PDF, DOC, DOCX, JPG, PNG.</span>
                                        </p>
                                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-4">
                                            If you want to send files larger than 10MB, kindly email us a Drive link so we can review it.
                                        </p>
                                        
                                        {!file ? (
                                            <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Choose file or drag & drop</span>
                                                </div>
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    onChange={handleFileChange}
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                                />
                                            </label>
                                        ) : (
                                            <div className="flex items-center justify-between p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl">
                                                <div className="flex items-center gap-4 overflow-hidden">
                                                    <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                                    <div className="truncate">
                                                        <p className="font-semibold text-slate-900 dark:text-white truncate">{file.name}</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setFile(null)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors flex-shrink-0"
                                                >
                                                    <X size={24} />
                                                </button>
                                            </div>
                                        )}
                                        
                                        {fileError && (
                                            <p className="text-sm text-red-500 mt-3 font-medium flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" /> {fileError}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className={labelClasses}>NDA Required? *</label>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                            Do you require a Non-Disclosure Agreement before discussing further details?
                                        </p>
                                        <div className="flex gap-6 mt-2">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center justify-center w-6 h-6">
                                                    <input type="radio" name="ndaRequired" value="Yes" checked={formData.ndaRequired === "Yes"} onChange={handleChange} className="peer w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 opacity-0 absolute cursor-pointer" />
                                                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-colors"></div>
                                                    <div className="absolute w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                                </div>
                                                <span className="text-slate-900 dark:text-white font-medium text-lg">Yes</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center justify-center w-6 h-6">
                                                    <input type="radio" name="ndaRequired" value="No" checked={formData.ndaRequired === "No"} onChange={handleChange} className="peer w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 opacity-0 absolute cursor-pointer" />
                                                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 peer-checked:border-blue-600 peer-checked:bg-blue-600 transition-colors"></div>
                                                    <div className="absolute w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                                                </div>
                                                <span className="text-slate-900 dark:text-white font-medium text-lg">No</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <hr className="border-slate-200 dark:border-slate-800" />

                            {/* Submit Footer */}
                            <div className="pt-4 pb-8">
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting || !!fileError}
                                    className="w-full relative flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-black text-xl hover:from-blue-500 hover:to-purple-500 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-blue-500/25"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            Submitting Request...
                                        </>
                                    ) : (
                                        <>
                                            Submit Project Details
                                            <Send className="w-6 h-6" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
