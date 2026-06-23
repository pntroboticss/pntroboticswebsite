"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit, Users, Briefcase, Eye, Download, X, FileText, Mail, Filter, CheckSquare, Square, AlertTriangle } from "lucide-react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type Job = {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  is_active: boolean;
  created_at: string;
};

type Application = {
  id: string;
  job_id: string;
  name: string;
  email: string;
  phone: string;
  resume_url: string;
  answers: any;
  status: string;
  created_at: string;
  job?: Job; // joined data
};

export default function CareersAdmin() {
  const [activeTab, setActiveTab] = useState<"jobs" | "applications" | "internships">("jobs");
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Job Modal State
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<Job>>({ title: "", type: "Full-Time", location: "", description: "", is_active: true });

  // App Modal State
  const [viewingApp, setViewingApp] = useState<Application | null>(null);

  // Filter & Bulk Selection
  const [appFilter, setAppFilter] = useState("All");
  const [internFilter, setInternFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = (ids: string[]) => {
    if (ids.every(id => selectedIds.has(id))) {
      const next = new Set(selectedIds);
      ids.forEach(id => next.delete(id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      ids.forEach(id => next.add(id));
      setSelectedIds(next);
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  // Open Gmail compose for a single applicant
  const contactApplicant = (email: string, name: string) => {
    const subject = encodeURIComponent(`Regarding Your Application – PNT Robotics`);
    const body = encodeURIComponent(`Dear ${name},\n\n`);
    window.open(`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`, '_blank');
  };

  // Bulk email — opens Gmail with all selected emails as BCC
  const bulkEmail = (apps: Application[]) => {
    const selected = apps.filter(a => selectedIds.has(a.id));
    if (selected.length === 0) return alert("Please select at least one applicant.");
    const bcc = selected.map(a => a.email).join(',');
    const subject = encodeURIComponent(`Update on Your Application – PNT Robotics`);
    window.open(`https://mail.google.com/mail/?view=cm&bcc=${encodeURIComponent(bcc)}&su=${subject}`, '_blank');
  };

  const STATUS_OPTIONS = ["All", "Pending", "Interview", "Accepted", "Rejected"];
  const STATUS_COLORS: Record<string, string> = {
    All: "bg-slate-100 text-slate-600",
    Pending: "bg-amber-100 text-amber-700",
    Interview: "bg-blue-100 text-blue-700",
    Accepted: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-red-100 text-red-700",
  };

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{ ids: string[]; label: string } | null>(null);

  const deleteApps = async (ids: string[]) => {
    for (const id of ids) {
      await supabase.from("job_applications").delete().eq("id", id);
    }
    setDeleteConfirm(null);
    clearSelection();
    fetchData();
  };

  const confirmDelete = (ids: string[], label: string) => {
    setDeleteConfirm({ ids, label });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: jobsData } = await supabase.from("job_postings").select("*").order("created_at", { ascending: false });
      if (jobsData) setJobs(jobsData);

      const { data: appsData } = await supabase.from("job_applications").select("*, job:job_postings(*)").order("created_at", { ascending: false });
      if (appsData) setApplications(appsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveJob = async () => {
    try {
      if (editingJob.id) {
        const { error } = await supabase.from("job_postings").update(editingJob).eq("id", editingJob.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("job_postings").insert([editingJob]);
        if (error) throw error;
      }
      setIsJobModalOpen(false);
      fetchData();
    } catch (e: any) {
      console.error(e);
      alert("Error saving job: " + (e.message || "Unknown error"));
    }
  };

  const toggleJobStatus = async (job: Job) => {
    await supabase.from("job_postings").update({ is_active: !job.is_active }).eq("id", job.id);
    fetchData();
  };

  const deleteJob = async (id: string) => {
    if (!confirm("Are you sure? This will delete the job and all its applications.")) return;
    await supabase.from("job_postings").delete().eq("id", id);
    fetchData();
  };

  const updateAppStatus = async (id: string, status: string) => {
    await supabase.from("job_applications").update({ status }).eq("id", id);
    fetchData();
    if (viewingApp && viewingApp.id === id) {
      setViewingApp({ ...viewingApp, status });
    }
  };

  const exportToCSV = () => {
    if (applications.length === 0) return alert("No applications to export");

    const allAnswerKeys = new Set<string>();
    applications.forEach(app => {
      Object.keys(app.answers || {}).forEach(k => allAnswerKeys.add(k));
    });
    const answerHeaders = Array.from(allAnswerKeys);

    const headers = ["ID", "Applicant Name", "Email", "Phone", "Job Applied For", "Status", "Date Applied", "Resume URL", ...answerHeaders];
    
    const rows = applications.map(app => {
      const baseData = [app.id, `"${app.name}"`, app.email, app.phone, `"${app.job?.title || 'Unknown Job'}"`, app.status, new Date(app.created_at).toLocaleDateString(), `"${app.resume_url}"`];
      const answerData = answerHeaders.map(key => {
        let val = app.answers?.[key] || "";
        if (typeof val === 'string') val = `"${val.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
        return val;
      });
      return [...baseData, ...answerData].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `job_applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadProfilePDF = async (app: Application) => {
    try {
      const pdfDoc = await PDFDocument.create();
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const primaryColor = rgb(0.145, 0.380, 0.925); // Blue-600
      const textColor = rgb(0.2, 0.2, 0.2);
      const labelColor = rgb(0.5, 0.5, 0.5);

      let page = pdfDoc.addPage();
      let { width, height } = page.getSize();
      let y = height;

      const checkPageBreak = (neededSpace: number) => {
        if (y - neededSpace < 50) {
          page = pdfDoc.addPage();
          y = height - 50;
        }
      };

      // Header Rectangle
      page.drawRectangle({ x: 0, y: height - 120, width, height: 120, color: rgb(0.06, 0.09, 0.16) }); // Dark Slate

      // Helper to turn the dark logo white dynamically using an HTML5 Canvas
      const getWhiteLogoBytes = (): Promise<ArrayBuffer> => new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("No 2d context");
          
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < imgData.data.length; i += 4) {
            if (imgData.data[i + 3] > 0) { // If pixel is visible
              const r = imgData.data[i];
              const g = imgData.data[i + 1];
              const b = imgData.data[i + 2];
              
              // If the pixel is distinctly BLUE, we leave it alone!
              // (Blue pixels have significantly higher B value than R)
              const isBlue = b > r + 30;
              
              if (!isBlue) {
                // Otherwise (black text, dark gray robot parts), turn it pure white
                imgData.data[i] = 255;
                imgData.data[i + 1] = 255;
                imgData.data[i + 2] = 255;
              }
            }
          }
          ctx.putImageData(imgData, 0, 0);
          
          canvas.toBlob(blob => {
            if (!blob) return reject("No blob");
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as ArrayBuffer);
            reader.readAsArrayBuffer(blob);
          }, "image/png");
        };
        img.onerror = reject;
        img.src = "/PNT%20Robo%20logo.png";
      });

      // Try to load Logo (fallback to text if missing)
      try {
        const logoBytes = await getWhiteLogoBytes();
        const logoImage = await pdfDoc.embedPng(logoBytes);
        const logoDims = logoImage.scale(0.3);
        page.drawImage(logoImage, { x: 50, y: height - 90, width: logoDims.width, height: logoDims.height });
      } catch (e) {
        page.drawText("PNT Robotics", { x: 50, y: height - 70, size: 24, font: fontBold, color: rgb(1,1,1) });
      }

      // Title
      page.drawText("Applicant Profile", { x: width - 250, y: height - 60, size: 24, font: fontBold, color: rgb(1,1,1) });
      page.drawText(`Status: ${app.status} | Date: ${new Date(app.created_at).toLocaleDateString()}`, { x: width - 250, y: height - 80, size: 10, font: fontRegular, color: rgb(0.7,0.7,0.7) });

      y = height - 160;

      // Overview Section
      page.drawText("OVERVIEW", { x: 50, y, size: 14, font: fontBold, color: primaryColor });
      page.drawLine({ start: { x: 50, y: y - 8 }, end: { x: width - 50, y: y - 8 }, thickness: 1, color: primaryColor });
      y -= 30;

      const drawRow = (label: string, value: string, xOffset = 50) => {
        checkPageBreak(40);
        page.drawText(label.toUpperCase(), { x: xOffset, y, size: 9, font: fontBold, color: labelColor });
        
        // Wrap text
        const words = String(value || "-").split(' ');
        let currentLine = '';
        const lines = [];
        words.forEach(word => {
          const testLine = currentLine + word + ' ';
          // Split roughly at width 220
          if (fontRegular.widthOfTextAtSize(testLine, 11) > 220 && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word + ' ';
          } else {
            currentLine = testLine;
          }
        });
        lines.push(currentLine);

        lines.forEach((line, i) => {
          page.drawText(line.trim(), { x: xOffset, y: y - 16 - (i * 14), size: 11, font: fontRegular, color: textColor });
        });

        return lines.length * 14;
      };

      const h1 = drawRow("Full Name", app.name, 50);
      const h2 = drawRow("Email", app.email, 300);
      y -= Math.max(h1, h2) + 25;

      const h3 = drawRow("Phone", app.phone, 50);
      const appliedFor = app.answers?.application_type === "internship" ? "Internship – PNT Robotics" : (app.job?.title || "Unknown");
      const h4 = drawRow("Applied For", appliedFor, 300);
      y -= Math.max(h3, h4) + 40;

      // Detailed Info Section
      page.drawText("APPLICATION DETAILS", { x: 50, y, size: 14, font: fontBold, color: primaryColor });
      page.drawLine({ start: { x: 50, y: y - 8 }, end: { x: width - 50, y: y - 8 }, thickness: 1, color: primaryColor });
      y -= 30;

      const answers = app.answers || {};
      // Keys to skip from the detail grid (internal use only)
      const SKIP_KEYS = new Set(["application_type", "work_experience"]);
      const regularKeys = Object.keys(answers).filter(k => !SKIP_KEYS.has(k));

      const formatKey = (k: string) => k.replace(/_/g, ' ');

      for (let i = 0; i < regularKeys.length; i += 2) {
        const key1 = regularKeys[i];
        const val1 = answers[key1];
        const key2 = regularKeys[i + 1];
        const val2 = answers[key2];

        let height1 = drawRow(formatKey(key1), String(val1 ?? "-"), 50);
        let height2 = 0;
        if (key2) height2 = drawRow(formatKey(key2), String(val2 ?? "-"), 300);

        y -= Math.max(height1, height2) + 25;
      }

      // Work Experience — parse JSON and render each entry as a block
      const rawExp = answers["work_experience"];
      if (rawExp && rawExp !== "None") {
        let exps: { company: string; role: string; duration: string; work: string }[] = [];
        try { exps = JSON.parse(rawExp); } catch { exps = []; }

        if (exps.length > 0) {
          checkPageBreak(40);
          page.drawText("WORK EXPERIENCE", { x: 50, y, size: 14, font: fontBold, color: primaryColor });
          page.drawLine({ start: { x: 50, y: y - 8 }, end: { x: width - 50, y: y - 8 }, thickness: 1, color: primaryColor });
          y -= 30;

          exps.forEach((exp, idx) => {
            checkPageBreak(80);
            page.drawText(`Experience #${idx + 1}`, { x: 50, y, size: 11, font: fontBold, color: textColor });
            y -= 18;
            const r1 = drawRow("Company", exp.company || "-", 50);
            const r2 = drawRow("Role", exp.role || "-", 300);
            y -= Math.max(r1, r2) + 12;
            const r3 = drawRow("Duration", exp.duration || "-", 50);
            y -= r3 + 12;
            const r4 = drawRow("Work Done", exp.work || "-", 50);
            y -= r4 + 20;
          });
        }
      }

      // Merge Original Resume
      try {
        const resumeBytes = await fetch(app.resume_url).then(res => res.arrayBuffer());
        const resumePdf = await PDFDocument.load(resumeBytes);
        const copiedPages = await pdfDoc.copyPages(resumePdf, resumePdf.getPageIndices());
        copiedPages.forEach((p) => pdfDoc.addPage(p));
      } catch (resumeErr) {
        console.error("Could not merge resume PDF:", resumeErr);
        checkPageBreak(50);
        y -= 20;
        page.drawText("* Note: Could not attach the original resume PDF. Please download it separately.", { x: 50, y, size: 10, font: fontBold, color: rgb(0.8, 0.2, 0.2) });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${app.name.replace(/\s+/g, '_')}_Full_Profile.pdf`;
      link.click();
    } catch (e) {
      console.error(e);
      alert("Error generating merged PDF profile. Make sure 'npm install pdf-lib' was run.");
    }
  };

  if (loading) return <div className="p-8 text-slate-500 font-bold">Loading Careers Data...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Careers & Hiring</h1>
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex-wrap gap-1">
          <button onClick={() => setActiveTab("jobs")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "jobs" ? "bg-white dark:bg-slate-700 shadow text-blue-600" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}>
            Job Postings
          </button>
          <button onClick={() => setActiveTab("applications")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "applications" ? "bg-white dark:bg-slate-700 shadow text-purple-600" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}>
            Applications
            {applications.filter(a => a.status === "Pending" && a.answers?.application_type !== "internship").length > 0 && (
              <span className="bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{applications.filter(a => a.status === "Pending" && a.answers?.application_type !== "internship").length}</span>
            )}
          </button>
          <button onClick={() => setActiveTab("internships")} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "internships" ? "bg-white dark:bg-slate-700 shadow text-amber-600" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}>
            Internships
            {applications.filter(a => a.status === "Pending" && a.answers?.application_type === "internship").length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{applications.filter(a => a.status === "Pending" && a.answers?.application_type === "internship").length}</span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "jobs" && (
        <div className="space-y-6">
          <button onClick={() => { setEditingJob({ title: "", type: "Full-Time", location: "Dombivli, Maharashtra", description: "", is_active: true }); setIsJobModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2">
            <Plus size={18} /> Add New Job
          </button>

          <div className="grid gap-4">
            {jobs.map(job => (
              <div key={job.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    {job.title}
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold ${job.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>
                      {job.is_active ? "Active" : "Closed"}
                    </span>
                  </h3>
                  <div className="text-sm text-slate-500 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Briefcase size={14}/> {job.type}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                    {applications.filter(a => a.job_id === job.id).length} Applicants
                  </div>
                  <button onClick={() => toggleJobStatus(job)} className="px-4 py-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg">
                    {job.is_active ? "Close Job" : "Reopen"}
                  </button>
                  <button onClick={() => { setEditingJob(job); setIsJobModalOpen(true); }} className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => deleteJob(job.id)} className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {jobs.length === 0 && <p className="text-slate-500">No job postings created yet.</p>}
          </div>
        </div>
      )}

      {activeTab === "applications" && (() => {
        const jobApps = applications.filter(a => a.answers?.application_type !== "internship");
        const filtered = appFilter === "All" ? jobApps : jobApps.filter(a => a.status === appFilter);
        const filteredIds = filtered.map(a => a.id);
        const allChecked = filteredIds.length > 0 && filteredIds.every(id => selectedIds.has(id));
        return (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={15} className="text-slate-400" />
              {STATUS_OPTIONS.map(s => (
                <button key={s} onClick={() => { setAppFilter(s); clearSelection(); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 ${
                    appFilter === s ? `${STATUS_COLORS[s]} border-current` : "border-transparent bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                  }`}>{s}</button>
              ))}
            </div>
            <div className="flex gap-2">
              {selectedIds.size > 0 && (
                <>
                  <button onClick={() => bulkEmail(jobApps)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm">
                    <Mail size={15} /> Email Selected ({selectedIds.size})
                  </button>
                  <button onClick={() => confirmDelete(Array.from(selectedIds).filter(id => jobApps.some(a => a.id === id)), `${selectedIds.size} application(s)`)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm">
                    <Trash2 size={15} /> Delete Selected
                  </button>
                </>
              )}
              <button onClick={exportToCSV} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm">
                <Download size={15} /> Export CSV
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
            <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-xs uppercase font-bold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4 w-10">
                  <button onClick={() => toggleSelectAll(filteredIds)} className="text-slate-400 hover:text-blue-600">
                    {allChecked ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} />}
                  </button>
                </th>
                <th className="p-4">App ID</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Applied For</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(app => (
                <tr key={app.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selectedIds.has(app.id) ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}>
                  <td className="p-4">
                    <button onClick={() => toggleSelect(app.id)} className="text-slate-400 hover:text-blue-600">
                      {selectedIds.has(app.id) ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} />}
                    </button>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-600 dark:text-slate-400">
                      {app.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{app.name}</div>
                    <div className="text-xs text-slate-500">{app.email}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                    {app.job?.title || "Unknown Job"}
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <select
                      value={app.status}
                      onChange={(e) => updateAppStatus(app.id, e.target.value)}
                      className={`text-xs font-bold px-2 py-1 rounded-md outline-none border-none
                        ${app.status === 'Pending' ? 'bg-amber-100 text-amber-700' : ''}
                        ${app.status === 'Interview' ? 'bg-blue-100 text-blue-700' : ''}
                        ${app.status === 'Rejected' ? 'bg-red-100 text-red-700' : ''}
                        ${app.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : ''}
                      `}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Interview">Interview</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Accepted">Accepted</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewingApp(app)} className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 flex items-center gap-1.5">
                        <Eye size={13} /> Review
                      </button>
                      <button onClick={() => contactApplicant(app.email, app.name)} className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5">
                        <Mail size={13} /> Contact
                      </button>
                      <button onClick={() => confirmDelete([app.id], app.name)} className="text-red-500 bg-red-50 dark:bg-red-900/20 p-1.5 rounded-lg hover:bg-red-100 flex items-center">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-slate-500">No applications matching this filter.</td></tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
        );
      })()}

      {activeTab === "internships" && (() => {
        const internApps = applications.filter(a => a.answers?.application_type === "internship");
        const filtered = internFilter === "All" ? internApps : internApps.filter(a => a.status === internFilter);
        const filteredIds = filtered.map(a => a.id);
        const allChecked = filteredIds.length > 0 && filteredIds.every(id => selectedIds.has(id));
        return (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={15} className="text-amber-400" />
              {STATUS_OPTIONS.map(s => (
                <button key={s} onClick={() => { setInternFilter(s); clearSelection(); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 ${
                    internFilter === s ? `${STATUS_COLORS[s]} border-current` : "border-transparent bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                  }`}>{s}</button>
              ))}
            </div>
            {selectedIds.size > 0 && (
              <div className="flex gap-2">
                <button onClick={() => bulkEmail(internApps)} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm">
                  <Mail size={15} /> Email Selected ({selectedIds.size})
                </button>
                <button onClick={() => confirmDelete(Array.from(selectedIds).filter(id => internApps.some(a => a.id === id)), `${selectedIds.size} internship application(s)`)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm">
                  <Trash2 size={15} /> Delete Selected
                </button>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
            <table className="w-full text-left">
            <thead className="bg-amber-50 dark:bg-amber-950/30 text-xs uppercase font-bold text-amber-700 dark:text-amber-400 border-b border-amber-100 dark:border-amber-900/40">
              <tr>
                <th className="p-4 w-10">
                  <button onClick={() => toggleSelectAll(filteredIds)} className="text-amber-400 hover:text-amber-600">
                    {allChecked ? <CheckSquare size={18} className="text-amber-600" /> : <Square size={18} />}
                  </button>
                </th>
                <th className="p-4">App ID</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Applied For</th>
                <th className="p-4">Interest</th>
                <th className="p-4">Education</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(app => (
                <tr key={app.id} className={`hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors ${selectedIds.has(app.id) ? 'bg-amber-50 dark:bg-amber-950/30' : ''}`}>
                  <td className="p-4">
                    <button onClick={() => toggleSelect(app.id)} className="text-slate-400 hover:text-amber-600">
                      {selectedIds.has(app.id) ? <CheckSquare size={18} className="text-amber-600" /> : <Square size={18} />}
                    </button>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-xs bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-md text-amber-700 dark:text-amber-400">
                      {app.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 dark:text-white">{app.name}</div>
                    <div className="text-xs text-slate-500">{app.email}</div>
                    <div className="text-xs text-slate-400">{app.phone}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full">Internship</span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300 max-w-[160px] truncate">
                    {app.answers?.area_of_interest || "-"}
                  </td>
                  <td className="p-4 text-sm text-slate-500 capitalize">
                    {app.answers?.education_status || "-"}
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <select
                      value={app.status}
                      onChange={(e) => updateAppStatus(app.id, e.target.value)}
                      className={`text-xs font-bold px-2 py-1 rounded-md outline-none border-none
                        ${app.status === 'Pending' ? 'bg-amber-100 text-amber-700' : ''}
                        ${app.status === 'Interview' ? 'bg-blue-100 text-blue-700' : ''}
                        ${app.status === 'Rejected' ? 'bg-red-100 text-red-700' : ''}
                        ${app.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : ''}
                      `}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Interview">Shortlisted</option>
                      <option value="Accepted">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewingApp(app)} className="text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-100 flex items-center gap-1.5">
                        <Eye size={13} /> View
                      </button>
                      <button onClick={() => contactApplicant(app.email, app.name)} className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5">
                        <Mail size={13} /> Contact
                      </button>
                      <button onClick={() => confirmDelete([app.id], app.name)} className="text-red-500 bg-red-50 dark:bg-red-900/20 p-1.5 rounded-lg hover:bg-red-100 flex items-center">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="p-8 text-center text-slate-500">No internship applications matching this filter.</td></tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
        );
      })()}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-red-100 dark:border-red-900/30">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-5">
                <AlertTriangle className="text-red-500" size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Delete Application?</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-2">
                You are about to permanently delete <strong className="text-slate-800 dark:text-white">{deleteConfirm.label}</strong>.
              </p>
              <p className="text-xs text-red-500 font-semibold mb-8">This action cannot be undone.</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                  Cancel
                </button>
                <button onClick={() => deleteApps(deleteConfirm.ids)} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black transition-all flex items-center justify-center gap-2">
                  <Trash2 size={16} /> Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {isJobModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold dark:text-white">{editingJob.id ? "Edit Job" : "Create New Job"}</h2>
              <button onClick={() => setIsJobModalOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                <input type="text" value={editingJob.title} onChange={e => setEditingJob({...editingJob, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 dark:text-white outline-none" placeholder="e.g. Robotics Engineer" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Job Type</label>
                  <select value={editingJob.type} onChange={e => setEditingJob({...editingJob, type: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 dark:text-white outline-none">
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <input type="text" value={editingJob.location} onChange={e => setEditingJob({...editingJob, location: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 dark:text-white outline-none" placeholder="e.g. Dombivli, Maharashtra" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Job Description & Prerequisites (Markdown supported)</label>
                <textarea rows={6} value={editingJob.description} onChange={e => setEditingJob({...editingJob, description: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 dark:text-white outline-none font-mono text-sm" placeholder="List responsibilities, requirements, prerequisites..." />
              </div>
              <button onClick={saveJob} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 mt-4">
                Save Job
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingApp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{viewingApp.name}</h2>
                  {viewingApp.answers?.application_type === "internship" ? (
                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full">Internship</span>
                  ) : (
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-2.5 py-1 rounded-full">Job Application</span>
                  )}
                </div>
                <p className="text-slate-500 font-medium">
                  Applied for <span className="text-blue-600 dark:text-blue-400 font-bold">
                    {viewingApp.answers?.application_type === "internship" ? "Internship" : (viewingApp.job?.title || "Unknown Job")}
                  </span> on {new Date(viewingApp.created_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  App ID: <span className="font-bold text-slate-600 dark:text-slate-300">{viewingApp.id.slice(0, 8).toUpperCase()}</span>
                  <span className="text-slate-300 dark:text-slate-600 mx-2">|</span>
                  Full ID: {viewingApp.id}
                </p>
              </div>
              <button onClick={() => setViewingApp(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 text-slate-500"><X size={20}/></button>
            </div>

            <div className="space-y-8">
              {/* Top Meta */}
              <div className="flex flex-wrap gap-4">
                <button onClick={() => downloadProfilePDF(viewingApp)} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-200 shadow-md transition-colors">
                  <FileText size={18} /> Print Full Profile (Merged PDF)
                </button>
                <a href={viewingApp.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-md">
                  <Download size={18} /> Original CV
                </a>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-5 py-3 rounded-xl">
                  <span className="text-slate-500 text-sm font-bold">Email:</span>
                  <a href={`mailto:${viewingApp.email}`} className="font-bold text-slate-900 dark:text-white">{viewingApp.email}</a>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-5 py-3 rounded-xl">
                  <span className="text-slate-500 text-sm font-bold">Phone:</span>
                  <a href={`tel:${viewingApp.phone}`} className="font-bold text-slate-900 dark:text-white">{viewingApp.phone}</a>
                </div>
              </div>

              {/* Detailed Answers Grid */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Users size={18}/> Applicant Data</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                  {Object.entries(viewingApp.answers || {}).map(([key, value]) => {
                    const formatKey = (k: string) => k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    return (
                      <div key={key} className={typeof value === 'string' && String(value).length > 50 ? "md:col-span-2" : ""}>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{formatKey(key)}</div>
                        <div className="text-slate-900 dark:text-slate-200 font-medium whitespace-pre-wrap">{value ? String(value) : "-"}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Update Status */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Update Application Status</label>
                <div className="flex gap-3">
                  {['Pending', 'Interview', 'Accepted', 'Rejected'].map(status => (
                    <button 
                      key={status}
                      onClick={() => updateAppStatus(viewingApp.id, status)}
                      className={`px-6 py-2.5 rounded-xl font-bold transition-all border-2
                        ${viewingApp.status === status 
                          ? (status === 'Pending' ? 'border-amber-500 bg-amber-50 text-amber-700' : 
                             status === 'Interview' ? 'border-blue-500 bg-blue-50 text-blue-700' :
                             status === 'Accepted' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' :
                             'border-red-500 bg-red-50 text-red-700')
                          : 'border-transparent bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                        }
                      `}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
