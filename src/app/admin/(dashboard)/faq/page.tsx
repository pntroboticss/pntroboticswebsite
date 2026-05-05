"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Faq {
    _id: string;
    question: string;
    answer: string;
    order: number;
}

export default function AdminFaq() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Form state
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [order, setOrder] = useState("0");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const res = await fetch("/api/admin/faq");
            const data = await res.json();
            setFaqs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch FAQs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question || !answer) return;

        setSaving(true);
        try {
            const res = await fetch("/api/admin/faq", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, answer, order: parseInt(order) || 0 })
            });
            if (res.ok) {
                setQuestion("");
                setAnswer("");
                setOrder("0");
                fetchFaqs();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        setDeleting(true);
        try {
            const res = await fetch("/api/admin/faq", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: deleteId })
            });
            if (res.ok) {
                setDeleteId(null);
                fetchFaqs();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <div className="p-8 flex items-center justify-center h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <AnimatePresence mode="wait">
                {deleteId && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center"
                        >
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Delete FAQ?</h3>
                            <p className="text-slate-500 text-sm mb-6">This action cannot be undone. Are you sure you want to remove this question?</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                    {deleting ? "Deleting..." : "OK"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div>
                <h1 className="text-3xl font-black text-slate-800 dark:text-white">FAQ Management</h1>
                <p className="text-slate-500 mt-2">Add frequently asked questions to the Contact Us page.</p>
            </div>

            {/* Add FAQ Form */}
            <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Add New FAQ</h2>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-slate-500">Question *</label>
                    <input
                        required
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="e.g. Do you provide lab equipment?"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase text-slate-500">Answer *</label>
                    <textarea
                        required
                        rows={3}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                        placeholder="Yes, we provide end-to-end setup..."
                    />
                </div>

                <div className="space-y-1.5 w-1/3">
                    <label className="text-xs font-semibold uppercase text-slate-500">Sort Order</label>
                    <input
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add FAQ
                    </button>
                </div>
            </form>

            {/* List */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Current FAQs ({faqs.length})</h2>

                <AnimatePresence>
                    {faqs.length === 0 ? (
                        <p className="text-slate-500 text-sm">No FAQs added yet.</p>
                    ) : (
                        faqs.map((faq) => (
                            <motion.div
                                key={faq._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-start justify-between gap-6"
                            >
                                <div className="space-y-2 flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{faq.question}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-wrap">{faq.answer}</p>
                                    <div className="mt-2 text-xs text-slate-400 font-mono">Order: {faq.order}</div>
                                </div>
                                <button
                                    onClick={() => setDeleteId(faq._id)}
                                    className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 shrink-0 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
