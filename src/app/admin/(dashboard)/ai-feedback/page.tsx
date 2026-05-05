"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ThumbsDown, ThumbsUp, Loader2, AlertCircle } from "lucide-react";

interface Feedback {
    _id: string;
    userMessage: string;
    aiResponse: string;
    isThumbsUp: boolean;
    createdAt: string;
}

export default function AIFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"down" | "up" | "all">("down");

    useEffect(() => {
        fetchFeedbacks(filter);
    }, [filter]);

    const fetchFeedbacks = async (type: "down" | "up" | "all") => {
        setLoading(true);
        try {
            const res = await fetch(`/api/chat/feedback?type=${type}`);
            if (res.ok) {
                const data = await res.json();
                setFeedbacks(data);
            }
        } catch (error) {
            console.error("Failed to fetch feedback:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-indigo-500" />
                        AI Chatbot Feedback
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Review user ratings on the AI's responses to improve the Knowledge Base.</p>
                </div>

                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <button
                        onClick={() => setFilter("down")}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === "down" ? "bg-white dark:bg-slate-700 text-red-500 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                    >
                        Needs Improvement (Thumbs Down)
                    </button>
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === "all" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                    >
                        All Feedback
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="h-64 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
            ) : feedbacks.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-slate-500">
                    <AlertCircle className="w-10 h-10 mb-3 text-slate-300 dark:text-slate-700" />
                    <p className="font-semibold text-slate-600 dark:text-slate-400">No {filter === 'down' ? 'negative ' : ''}feedback found.</p>
                    {filter === 'down' && <p className="text-sm mt-1">Great job! The AI is answering questions perfectly.</p>}
                </div>
            ) : (
                <div className="grid gap-4">
                    {feedbacks.map((item, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={item._id}
                            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${item.isThumbsUp ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"}`}>
                                            {item.isThumbsUp ? <ThumbsUp className="w-3 h-3" /> : <ThumbsDown className="w-3 h-3" />}
                                            {item.isThumbsUp ? "Helpful" : "Needs Review"}
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium">
                                            {new Date(item.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">User Asked:</p>
                                    <div className="bg-blue-50 dark:bg-blue-500/5 p-4 rounded-xl text-slate-700 dark:text-slate-200 text-sm font-medium border border-blue-100 dark:border-blue-500/10">
                                        {item.userMessage}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">AI Responded:</p>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-slate-600 dark:text-slate-300 text-sm leading-relaxed border border-slate-100 dark:border-slate-800/80">
                                        {item.aiResponse}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
