"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Box, Plus, Trash2, ToggleLeft, ToggleRight,
    AlertCircle, CheckCircle2, Loader2, GripVertical,
    ChevronDown, ChevronUp, Info
} from "lucide-react";

interface HardwareModelEntry {
    _id: string;
    name: string;
    description: string;
    modelPath: string;
    active: boolean;
    sortOrder: number;
    createdAt: string;
}

const EMPTY_FORM = { name: "", description: "", modelPath: "/model.glb", sortOrder: 0 };

export default function HardwareModelsPage() {
    const [models, setModels] = useState<HardwareModelEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    const showToast = (type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchModels = async () => {
        try {
            const res = await fetch("/api/admin/hardware-models");
            if (!res.ok) throw new Error("Failed to load");
            // Get ALL models including inactive for admin view
            const allRes = await fetch("/api/admin/hardware-models");
            const data = await allRes.json();
            setModels(Array.isArray(data) ? data : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchModels(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/admin/hardware-models", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            showToast("success", "3D model added successfully!");
            setForm(EMPTY_FORM);
            setShowForm(false);
            fetchModels();
        } catch (err: any) {
            showToast("error", err.message || "Failed to add model");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this hardware model entry?")) return;
        try {
            const res = await fetch(`/api/admin/hardware-models?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            showToast("success", "Deleted.");
            fetchModels();
        } catch (err: any) {
            showToast("error", err.message || "Failed to delete");
        }
    };

    const handleToggleActive = async (id: string, current: boolean) => {
        try {
            const res = await fetch(`/api/admin/hardware-models?id=${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: !current }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            fetchModels();
        } catch (err: any) {
            showToast("error", err.message || "Failed to update");
        }
    };

    return (
        <div className="min-h-screen p-6 lg:p-8 space-y-8">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md border text-sm font-semibold ${
                            toast.type === "success"
                                ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                                : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300"
                        }`}
                    >
                        {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {toast.msg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                            <Box className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">3D Hardware Models</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm ml-12">
                        Manage the 3D models displayed on the College Training page interactive viewer.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm((v) => !v)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-indigo-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Add 3D Model
                    {showForm ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                </button>
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-2xl text-sm text-blue-700 dark:text-blue-300">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                    <p className="font-semibold">How to add a 3D model</p>
                    <p className="mt-0.5 text-blue-600 dark:text-blue-400 font-normal">
                        Upload a <code className="bg-blue-100 dark:bg-blue-800/50 px-1 rounded">.glb</code> file to your <code className="bg-blue-100 dark:bg-blue-800/50 px-1 rounded">/public/models/</code> folder,
                        then add its path here (e.g. <code className="bg-blue-100 dark:bg-blue-800/50 px-1 rounded">/models/robot-arm.glb</code>).
                        The AGV is built-in and always shown first.
                    </p>
                </div>
            </div>

            {/* Add Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                        className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"
                    >
                        <h2 className="text-lg font-black text-slate-800 dark:text-white mb-5">New 3D Model Entry</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Model Name *</label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Robot Arm"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Model File Path *</label>
                                <input
                                    required
                                    value={form.modelPath}
                                    onChange={(e) => setForm({ ...form, modelPath: e.target.value })}
                                    placeholder="/models/robot-arm.glb"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Description</label>
                                <textarea
                                    rows={2}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="e.g. 6-axis industrial robot arm used in advanced automation labs."
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sort Order</label>
                                <input
                                    type="number"
                                    value={form.sortOrder}
                                    onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <p className="text-xs text-slate-400">Lower numbers appear first (after the built-in AGV).</p>
                            </div>
                            <div className="flex items-end justify-end gap-3 md:col-span-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-bold text-sm disabled:opacity-50 hover:shadow-lg transition-all"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    {saving ? "Saving..." : "Add Model"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Models List */}
            <div className="space-y-4">
                {/* Built-in AGV (read-only) */}
                <div className="flex items-center gap-4 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-700/40 rounded-2xl">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                        <Box className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800 dark:text-white text-sm">Autonomous Guided Vehicle</p>
                            <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">Built-in</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">/model.glb</p>
                        <p className="text-xs text-slate-400 mt-0.5">Always shown first. Cannot be removed.</p>
                    </div>
                    <div className="shrink-0">
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-700">
                            Active
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    </div>
                ) : models.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                        <Box className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-semibold">No additional models yet</p>
                        <p className="text-sm mt-1">Click "Add 3D Model" to add a new robot or hardware model.</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {models.map((m) => (
                            <motion.div
                                key={m._id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`flex items-center gap-4 p-4 border rounded-2xl transition-all ${
                                    m.active
                                        ? "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                                        : "bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-700/50 opacity-60"
                                }`}
                            >
                                <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                                    <Box className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">{m.name}</p>
                                    <p className="text-xs text-slate-400 font-mono mt-0.5">{m.modelPath}</p>
                                    {m.description && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{m.description}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => handleToggleActive(m._id, m.active)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                            m.active
                                                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100"
                                                : "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-200"
                                        }`}
                                        title={m.active ? "Click to hide" : "Click to show"}
                                    >
                                        {m.active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                                        {m.active ? "Visible" : "Hidden"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(m._id)}
                                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-200 dark:hover:border-red-800 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
