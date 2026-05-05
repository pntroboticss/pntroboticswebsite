"use client";
import { motion } from "framer-motion";
import { FileText, Plus, Bell } from "lucide-react";

export default function AdminBlog() {
    return (
        <div className="space-y-8">
            <header className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-500 tracking-tight">News & Engineering Blog</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-lg">
                        Draft full articles, publish tech updates, and manage the student newsletter subscriber list.
                    </p>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-sm text-center relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-[80px] -z-10"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-[80px] -z-10"></div>

                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6 transform rotate-3">
                    <FileText className="w-10 h-10 text-white transform -rotate-3" />
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-wide">CMS Engine Coming Soon</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8 text-base">
                    This portal will become the centralized writing desk for the "The Future of Learning, Delivered" newsletter section you teased on the homepage. Soon you'll be able to write rich markdown articles and mass-email your subscribers directly from here!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button disabled className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-xl shadow-inner cursor-not-allowed flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Draft New Article
                    </button>
                    <button disabled className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold rounded-xl shadow-inner cursor-not-allowed flex items-center gap-2">
                        <Bell className="w-5 h-5" /> Blast Newsletter
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
