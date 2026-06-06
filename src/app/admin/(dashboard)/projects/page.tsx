"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Calendar, FileText, ChevronDown, ChevronUp } from "lucide-react";

export default function AdminProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from("custom_projects")
                .select("*")
                .order("created_at", { ascending: false });
            
            if (!error && data) setProjects(data);
            setIsLoading(false);
        };
        fetchProjects();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Custom Projects</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Complex project requests submitted through the Custom Project Modal.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 w-10"></th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Project Type</th>
                                <th className="px-6 py-4">Budget</th>
                                <th className="px-6 py-4">Timeline</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No custom project requests found.</td>
                                </tr>
                            ) : (
                                projects.map((project) => (
                                    <React.Fragment key={project.id}>
                                        <tr 
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                            onClick={() => setExpandedRow(expandedRow === project.id ? null : project.id)}
                                        >
                                            <td className="px-6 py-4">
                                                {expandedRow === project.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(project.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-900 dark:text-white">{project.name}</p>
                                                <a href={`mailto:${project.email}`} className="text-blue-500 hover:underline">{project.email}</a>
                                            </td>
                                            <td className="px-6 py-4 font-medium">{project.project_type || "N/A"}</td>
                                            <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-bold">{project.budget || "N/A"}</td>
                                            <td className="px-6 py-4">{project.time_frame || "N/A"}</td>
                                        </tr>
                                        {expandedRow === project.id && (
                                            <tr className="bg-slate-50 dark:bg-slate-900/50">
                                                <td colSpan={6} className="px-6 py-6">
                                                    <div className="grid md:grid-cols-2 gap-8 text-sm">
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 dark:text-white mb-2 border-b border-slate-200 dark:border-slate-700 pb-2">Business Details</h4>
                                                            <div className="space-y-2">
                                                                <p><span className="font-medium">Entity:</span> {project.entity_type}</p>
                                                                <p><span className="font-medium">Industry:</span> {project.industry_type}</p>
                                                                <p><span className="font-medium">Stage:</span> {project.stage_of_development}</p>
                                                                <p><span className="font-medium">Intended Use:</span> {project.intended_use}</p>
                                                                <p><span className="font-medium">Target Audience:</span> {project.target_audience}</p>
                                                                <p><span className="font-medium text-amber-600">NDA Required:</span> {project.nda_required}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 dark:text-white mb-2 border-b border-slate-200 dark:border-slate-700 pb-2">Technical Details</h4>
                                                            <div className="space-y-2">
                                                                <p><span className="font-medium">Quantity:</span> {project.quantity}</p>
                                                                <p><span className="font-medium">Use Case:</span></p>
                                                                <p className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">{project.use_case}</p>
                                                                <p><span className="font-medium mt-2 block">Requirements:</span></p>
                                                                <p className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{project.requirements}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
