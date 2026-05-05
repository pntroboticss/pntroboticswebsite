"use client";

import { useEffect, useState } from "react";
import { Mail, Calendar, Phone, Trash2, Download, Search, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Enquiry {
    _id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export default function EnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/contact");
            if (res.ok) {
                const data = await res.json();
                setEnquiries(data);
            }
        } catch (error) {
            console.error("Failed to fetch enquiries:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this enquiry?")) return;
        setDeleteLoading(id);
        try {
            const res = await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
            if (res.ok) {
                setEnquiries((prev) => prev.filter((e) => e._id !== id));
            } else {
                alert("Failed to delete enquiry.");
            }
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleExportCSV = async () => {
        try {
            window.open("/api/admin/enquiries/export", "_blank");
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export enquiries.");
        }
    };

    const filteredEnquiries = enquiries.filter(
        (e) =>
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Enquiries inbox
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                        Manage messages from your website&apos;s contact form.
                    </p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all text-sm"
                >
                    <Download className="w-4 h-4" />
                    Export to Excel (CSV)
                </button>
            </header>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        />
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                        {filteredEnquiries.length} {filteredEnquiries.length === 1 ? 'Message' : 'Messages'}
                    </div>
                </div>

                {loading ? (
                    <div className="p-12">
                        <LoadingSpinner />
                    </div>
                ) : filteredEnquiries.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                        <Mail className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-medium">No enquiries found</p>
                        {searchTerm && <p className="text-sm mt-1">Try a different search term</p>}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {filteredEnquiries.map((enquiry) => (
                            <motion.div
                                key={enquiry._id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group relative"
                            >
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    {enquiry.name}
                                                    {!enquiry.read && (
                                                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                                                    )}
                                                </h3>
                                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                                                    {enquiry.subject}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg whitespace-nowrap">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date(enquiry.createdAt))}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                <a href={`mailto:${enquiry.email}`} className="hover:text-blue-500 hover:underline">{enquiry.email}</a>
                                            </div>
                                            {enquiry.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    <a href={`tel:${enquiry.phone}`} className="hover:text-blue-500 hover:underline">{enquiry.phone}</a>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                                            {enquiry.message}
                                        </div>
                                    </div>

                                    <div className="flex lg:flex-col justify-end lg:justify-start gap-2 pt-2 lg:pt-0">
                                        <button
                                            onClick={() => handleDelete(enquiry._id)}
                                            disabled={deleteLoading === enquiry._id}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete Message"
                                        >
                                            {deleteLoading === enquiry._id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
