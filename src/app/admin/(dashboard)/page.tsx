"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { MessageSquare, Rocket, Briefcase, Star, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminOverview() {
    const [stats, setStats] = useState({
        contacts: 0,
        projects: 0,
        careers: 0,
        testimonials: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const [contacts, projects, careers, testimonials] = await Promise.all([
                supabase.from("contacts").select("*", { count: "exact", head: true }),
                supabase.from("custom_projects").select("*", { count: "exact", head: true }),
                supabase.from("job_applications").select("*", { count: "exact", head: true }),
                supabase.from("client_testimonials").select("*", { count: "exact", head: true })
            ]);

            setStats({
                contacts: contacts.count || 0,
                projects: projects.count || 0,
                careers: careers.count || 0,
                testimonials: testimonials.count || 0
            });
            setIsLoading(false);
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    const cards = [
        { title: "General Contacts", count: stats.contacts, icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30", href: "/admin/contacts" },
        { title: "Custom Projects", count: stats.projects, icon: Rocket, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30", href: "/admin/projects" },
        { title: "Job Applications", count: stats.careers, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30", href: "/admin/careers" },
        { title: "Testimonials", count: stats.testimonials, icon: Star, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", href: "/admin/testimonials" }
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome back to the PNT Robotics Admin Portal.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <Link key={idx} href={card.href} className="block group">
                            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:shadow-lg group-hover:border-blue-500 dark:group-hover:border-blue-500 transition-all">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${card.bg}`}>
                                    <Icon className={`w-7 h-7 ${card.color}`} />
                                </div>
                                <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-1">{card.title}</h3>
                                <p className="text-4xl font-black text-slate-900 dark:text-white">{card.count}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
            
            <div className="mt-12 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Getting Started</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                    Use the sidebar on the left to navigate through different sections of your database. 
                    You can view incoming contact messages, assess custom project requests, download applicant resumes, and manage what testimonials appear on your homepage.
                </p>
            </div>
        </div>
    );
}
