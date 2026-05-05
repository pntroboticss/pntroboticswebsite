"use client";

import { useEffect, useState } from "react";
import { Ticket, Calendar, Trash2, Download, Search, Loader2, CheckCircle, Clock, XCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PaymentTicketType {
    _id: string;
    ticketId: string;
    clientName: string;
    courseName: string;
    amount: string;
    queryMessage: string;
    status: "open" | "resolved" | "closed";
    createdAt: string;
    updatedAt: string;
}

const STATUS_CONFIG = {
    open: { label: "Open", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400", icon: Clock },
    resolved: { label: "Resolved", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400", icon: CheckCircle },
    closed: { label: "Closed", color: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400", icon: XCircle },
};

type StatusFilter = "all" | "open" | "resolved" | "closed";

export default function PaymentTicketsPage() {
    const [tickets, setTickets] = useState<PaymentTicketType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const [statusLoading, setStatusLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/tickets");
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this ticket?")) return;
        setDeleteLoading(id);
        try {
            const res = await fetch(`/api/admin/tickets/${id}`, { method: "DELETE" });
            if (res.ok) {
                setTickets((prev) => prev.filter((t) => t._id !== id));
            } else {
                alert("Failed to delete ticket.");
            }
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        setStatusLoading(id);
        try {
            const res = await fetch(`/api/admin/tickets/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setTickets((prev) =>
                    prev.map((t) => (t._id === id ? { ...t, status: newStatus as PaymentTicketType["status"] } : t))
                );
            } else {
                alert("Failed to update status.");
            }
        } catch (error) {
            console.error("Status update failed:", error);
        } finally {
            setStatusLoading(null);
        }
    };

    const handleExportCSV = () => {
        window.open("/api/admin/tickets/export", "_blank");
    };

    const filteredTickets = tickets.filter((t) => {
        const matchesSearch =
            t.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.queryMessage.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        all: tickets.length,
        open: tickets.filter((t) => t.status === "open").length,
        resolved: tickets.filter((t) => t.status === "resolved").length,
        closed: tickets.filter((t) => t.status === "closed").length,
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Payment Tickets
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                        Track and manage payment queries from clients.
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

            {/* Status Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {(["all", "open", "resolved", "closed"] as StatusFilter[]).map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                            statusFilter === status
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                    >
                        {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                            {statusCounts[status]}
                        </span>
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by ticket ID, client, or course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                        />
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                        {filteredTickets.length} {filteredTickets.length === 1 ? "Ticket" : "Tickets"}
                    </div>
                </div>

                {loading ? (
                    <div className="p-12">
                        <LoadingSpinner />
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                        <Ticket className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-medium">No tickets found</p>
                        {searchTerm && <p className="text-sm mt-1">Try a different search term</p>}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        <AnimatePresence>
                            {filteredTickets.map((ticket) => {
                                const config = STATUS_CONFIG[ticket.status];
                                const StatusIcon = config.icon;
                                return (
                                    <motion.div
                                        key={ticket._id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group relative"
                                    >
                                        <div className="flex flex-col lg:flex-row gap-4">
                                            <div className="flex-1 space-y-3">
                                                {/* Header row */}
                                                <div className="flex items-center justify-between flex-wrap gap-2">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-mono font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-lg text-sm tracking-wider">
                                                            {ticket.ticketId}
                                                        </span>
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${config.color}`}>
                                                            <StatusIcon className="w-3 h-3" />
                                                            {config.label}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg whitespace-nowrap">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Intl.DateTimeFormat("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                            hour: "numeric",
                                                            minute: "numeric",
                                                        }).format(new Date(ticket.createdAt))}
                                                    </div>
                                                </div>

                                                {/* Client details */}
                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                                                    <span className="font-bold text-slate-800 dark:text-white">{ticket.clientName}</span>
                                                    <span className="text-slate-500">•</span>
                                                    <span className="text-slate-600 dark:text-slate-400">{ticket.courseName}</span>
                                                    {ticket.amount && ticket.amount !== "Not specified" && (
                                                        <>
                                                            <span className="text-slate-500">•</span>
                                                            <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{ticket.amount}</span>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Query message */}
                                                <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                                                    {ticket.queryMessage}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex lg:flex-col justify-end lg:justify-start gap-2 pt-2 lg:pt-0">
                                                {/* Status Dropdown */}
                                                <div className="relative">
                                                    <select
                                                        value={ticket.status}
                                                        onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                                                        disabled={statusLoading === ticket._id}
                                                        className="appearance-none pl-3 pr-8 py-2 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                    >
                                                        <option value="open">Open</option>
                                                        <option value="resolved">Resolved</option>
                                                        <option value="closed">Closed</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(ticket._id)}
                                                    disabled={deleteLoading === ticket._id}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete Ticket"
                                                >
                                                    {deleteLoading === ticket._id ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
