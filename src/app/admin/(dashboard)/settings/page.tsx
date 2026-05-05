"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Globe, CreditCard, Link as LinkIcon, Brain,
  Camera, Check, AlertCircle, Instagram, Linkedin, Twitter,
  Youtube, Briefcase, ExternalLink, Trash2, FileText,
  ChevronRight, Save, Menu, X, type LucideIcon, Zap
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fileToBase64 } from "@/lib/utils/fileToBase64";
import Image from "next/image";
import ImageCropper from "@/components/admin/ImageCropper";

interface SettingsForm {
  name: string;
  email: string;
  socialLinks: { instagram: string; linkedin: string; twitter: string; youtube: string };
  careersLink: string;
  bootcampLink: string;
  roboticsChampionshipLink: string;
  individualChampionshipLink: string;
  sheetsWebhookUrl: string;
  paymentDetails: {
    upiId: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
}

type SectionId = "account" | "links" | "integrations" | "ai";

const NAV_SECTIONS: {
  id: SectionId; label: string; icon: LucideIcon;
  gradient: string; badgeTxt?: string;
}[] = [
  { id: "account",      label: "My Account",              icon: User,       gradient: "from-blue-500 to-indigo-500" },
  { id: "links",        label: "Public Links",             icon: Globe,      gradient: "from-purple-500 to-violet-500", badgeTxt: "Social & Careers" },
  { id: "integrations", label: "Integrations & Payments", icon: CreditCard, gradient: "from-amber-400 to-orange-500", badgeTxt: "New" },
  { id: "ai",           label: "AI Knowledge",            icon: Brain,      gradient: "from-violet-500 to-fuchsia-500" },
];

const pill = [
  "w-full px-5 py-3.5 rounded-full",
  "border border-slate-200 dark:border-slate-700/60",
  "bg-slate-50 dark:bg-slate-800/80",
  "text-slate-800 dark:text-slate-100",
  "placeholder-slate-400 dark:placeholder-slate-500",
  "focus:outline-none focus:ring-2 focus:ring-indigo-400/40",
  "text-sm transition-all",
].join(" ");

const lbl = "text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block";

const fadeTab = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
  transition: { duration: 0.18 },
};

function SectionCard({
  label, icon: Icon, gradient, children,
}: {
  label: string; icon: LucideIcon; gradient: string; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-3xl bg-gradient-to-r ${gradient} p-px shadow-lg`}>
      <div className="bg-white dark:bg-slate-900 rounded-[calc(1.5rem-1px)] overflow-hidden">
        <div className={`h-1 w-full bg-gradient-to-r ${gradient}`} />
        <div className="flex items-center gap-3 px-6 py-5 bg-slate-50/50 dark:bg-slate-800/30">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-base font-black text-slate-800 dark:text-white tracking-tight">{label}</h2>
        </div>
        <div className="px-6 pb-7 pt-2 space-y-4">{children}</div>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const { register, handleSubmit, setValue, watch } = useForm<SettingsForm>({
    defaultValues: {
      socialLinks: { instagram: "", linkedin: "", twitter: "", youtube: "" },
      careersLink: "", bootcampLink: "", roboticsChampionshipLink: "", individualChampionshipLink: "", sheetsWebhookUrl: "",
      paymentDetails: { upiId: "", accountName: "", accountNumber: "", ifscCode: "", bankName: "" },
    },
  });

  const [loading, setLoading]             = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [previewImage, setPreviewImage]   = useState<string | null>(null);
  const [qrPreviewImage, setQrPreviewImage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus]       = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [fileToCrop, setFileToCrop]       = useState<{ file: File; type: "profile" | "qr" } | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>("account");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // KB
  const [kbFileName, setKbFileName]       = useState("");
  const [kbTextLength, setKbTextLength]   = useState(0);
  const [kbUploading, setKbUploading]     = useState(false);
  const [kbStatus, setKbStatus]           = useState("");

  // Link gen
  const [linkCourse, setLinkCourse]       = useState("");
  const [linkAmount, setLinkAmount]       = useState("");
  const [linkClientName, setLinkClientName] = useState("");
  const [linkCopied, setLinkCopied]       = useState(false);

  const generatedLink = (() => {
    const base = typeof window !== "undefined" ? window.location.origin : "https://pntacademy.com";
    const p = new URLSearchParams();
    if (linkAmount) p.set("amount", linkAmount);
    if (linkCourse) p.set("course", linkCourse);
    if (linkClientName) p.set("name", linkClientName);
    return `${base}/payments?${p.toString()}`;
  })();

  const switchTo = (id: SectionId) => {
    setActiveSection(id);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const d = await res.json();
        if (d?.name) setValue("name", d.name);
        if (d?.email) setValue("email", d.email);
        
        setPreviewImage(d?.profileImage || null);
        
        if (d?.socialLinks) {
          setValue("socialLinks.instagram", d.socialLinks.instagram || "");
          setValue("socialLinks.linkedin", d.socialLinks.linkedin || "");
          setValue("socialLinks.twitter", d.socialLinks.twitter || "");
          setValue("socialLinks.youtube", d.socialLinks.youtube || "");
        }
        setValue("careersLink", d?.careersLink || "");
        setValue("bootcampLink", d?.bootcampLink || "");
        setValue("roboticsChampionshipLink", d?.roboticsChampionshipLink || "");
        setValue("individualChampionshipLink", d?.individualChampionshipLink || "");
        setValue("sheetsWebhookUrl", d?.sheetsWebhookUrl || "");
        if (d?.paymentDetails) {
          setValue("paymentDetails.upiId", d.paymentDetails.upiId || "");
          setValue("paymentDetails.accountName", d.paymentDetails.accountName || "");
          setValue("paymentDetails.accountNumber", d.paymentDetails.accountNumber || "");
          setValue("paymentDetails.ifscCode", d.paymentDetails.ifscCode || "");
          setValue("paymentDetails.bankName", d.paymentDetails.bankName || "");
          setQrPreviewImage(d.paymentDetails.upiQrCodeBase64 || null);
        } else {
          setQrPreviewImage(null);
        }
      }
    } catch { /**/ }
    finally { setInitialLoading(false); }
  };

  useEffect(() => {
    loadSettings();
    fetch("/api/admin/knowledge-base").then(r => r.json()).then(d => {
      if (d.fileName)  setKbFileName(d.fileName);
      if (d.textLength) setKbTextLength(d.textLength);
    }).catch(() => {});
  }, [setValue]);

  const handleProfileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFileToCrop({ file: f, type: "profile" });
    e.target.value = "";
  };
  const handleQrSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFileToCrop({ file: f, type: "qr" });
    e.target.value = "";
  };
  const handleCropComplete = async (croppedFile: File) => {
    try {
      const b64 = await fileToBase64(croppedFile);
      if (fileToCrop?.type === "profile") setPreviewImage(b64);
      else if (fileToCrop?.type === "qr") setQrPreviewImage(b64);
    } catch { /**/ }
    finally { setFileToCrop(null); }
  };

  const onSubmit = async (form: SettingsForm) => {
    setLoading(true); setSaveStatus(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email, profileImage: previewImage,
          socialLinks: form.socialLinks,
          careersLink: form.careersLink, bootcampLink: form.bootcampLink,
          roboticsChampionshipLink: form.roboticsChampionshipLink,
          individualChampionshipLink: form.individualChampionshipLink,
          sheetsWebhookUrl: form.sheetsWebhookUrl,
          paymentDetails: { ...form.paymentDetails, upiQrCodeBase64: qrPreviewImage },
        }),
      });
      if (!res.ok) throw new Error();
      setSaveStatus({ type: "success", message: "Settings saved! Refreshing…" });
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      setSaveStatus({ type: "error", message: "Failed to save. Please try again." });
    } finally { setLoading(false); }
  };

  if (initialLoading) return <LoadingSpinner />;

  const activeMeta = NAV_SECTIONS.find(s => s.id === activeSection);

  // ── Nav buttons (shared) ──
  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {NAV_SECTIONS.map(({ id, label, icon: Icon, gradient, badgeTxt }) => {
        const isActive = activeSection === id;
        return mobile ? (
          <button key={id} onClick={() => switchTo(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-semibold ${isActive ? `bg-gradient-to-r ${gradient} text-white shadow-lg` : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
            {badgeTxt && !isActive && (
              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">{badgeTxt}</span>
            )}
            <ChevronRight className="w-3 h-3 ml-auto opacity-40" />
          </button>
        ) : (
          <button key={id} onClick={() => switchTo(id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl transition-all text-[13px] font-semibold ${isActive ? `bg-gradient-to-r ${gradient} text-white shadow-md` : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="truncate text-left flex-1">{label}</span>
            {badgeTxt && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black shrink-0 ${isActive ? "bg-white/20 text-white" : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400"}`}>
                {badgeTxt}
              </span>
            )}
          </button>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {loading && <LoadingSpinner />}

      {/* ── Animated background orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <motion.div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-200/40 dark:bg-indigo-900/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute top-1/3 -right-24 w-72 h-72 rounded-full bg-violet-200/40 dark:bg-violet-900/15 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.65, 0.35] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }} />
        <motion.div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-blue-200/30 dark:bg-blue-900/10 blur-3xl"
          animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.55, 0.3] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 6 }} />
        <div className="absolute inset-0 dark:hidden bg-[radial-gradient(circle,_#6366f115_1px,_transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 hidden dark:block bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />
      </div>

      {/* ── Sticky Top Bar ── */}
      <div className="relative z-30 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/60 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">Portal Settings</h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5">
              {activeMeta?.label}
            </p>
          </div>
          <button onClick={() => setMobileNavOpen(v => !v)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-bold border border-indigo-100 dark:border-indigo-500/20"
          >
            {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            {activeMeta && <span>{activeMeta.label}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="lg:hidden fixed inset-x-0 top-[69px] z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl px-4 py-4 space-y-1.5"
          >
            <NavItems mobile />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Layout ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 flex gap-8">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-28 space-y-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/40 rounded-3xl p-3 shadow-xl">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 py-1.5">Navigation</p>
            <NavItems />
          </div>
        </aside>

        {/* Main — single section at a time */}
        <div className="flex-1 min-w-0">

          {/* Save status */}
          <AnimatePresence>
            {saveStatus && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold mb-6 border
                  ${saveStatus.type === "success"
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                    : "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20"
                  }`}
              >
                {saveStatus.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
                {saveStatus.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Tab panels ── */}
          <AnimatePresence mode="wait">

            {/* ── MY ACCOUNT ── */}
            {activeSection === "account" && (
              <motion.div key="account" {...fadeTab}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <SectionCard label="My Account" icon={User} gradient="from-blue-500 to-indigo-500">
                    <div className="flex items-center gap-5 pb-5 mb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="relative group shrink-0 cursor-pointer">
                        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-3xl shadow-xl overflow-hidden relative">
                          {previewImage ? <Image src={previewImage} alt="Profile" fill className="object-cover" /> : <span>{watch("name")?.[0]?.toUpperCase() || "A"}</span>}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={20} className="text-white" />
                          </div>
                          <input type="file" accept="image/*" onChange={handleProfileSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <Camera className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-black text-slate-800 dark:text-white text-base">{watch("name") || "Director Name"}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{watch("email") || "director@pntacademy.com"}</p>
                        <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-full">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /> Admin
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={lbl}>Full Name</label>
                        <input type="text" {...register("name", { required: true })} className={pill} />
                      </div>
                      <div>
                        <label className={lbl}>Email Address</label>
                        <input type="email" {...register("email", { required: true })} className={pill} />
                      </div>
                    </div>
                  </SectionCard>
                  <StickyBar loading={loading} label="Account" onDiscard={loadSettings} />
                </form>
              </motion.div>
            )}

            {/* ── PUBLIC LINKS ── */}
            {activeSection === "links" && (
              <motion.div key="links" {...fadeTab}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <SectionCard label="Public Links" icon={Globe} gradient="from-purple-500 to-violet-500">
                    <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1 mb-1">
                      Social handles power the website footer &amp; contact page. Careers &amp; Bootcamp links control site-wide CTAs.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {([
                        { key: "socialLinks.instagram" as const, label: "Instagram", icon: <Instagram className="w-3.5 h-3.5 text-pink-500" />, ph: "https://instagram.com/pnt_academy" },
                        { key: "socialLinks.linkedin"  as const, label: "LinkedIn",  icon: <Linkedin className="w-3.5 h-3.5 text-blue-600" />,   ph: "https://linkedin.com/company/pnt" },
                        { key: "socialLinks.twitter"   as const, label: "X / Twitter", icon: <Twitter className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />, ph: "https://twitter.com/pntacademy" },
                        { key: "socialLinks.youtube"   as const, label: "YouTube",   icon: <Youtube className="w-3.5 h-3.5 text-red-600" />,      ph: "https://youtube.com/c/pntacademy" },
                      ]).map(({ key, label, icon, ph }) => (
                        <div key={key}>
                          <label className={`${lbl} flex items-center gap-1.5`}>{icon}{label}</label>
                          <input type="url" {...register(key)} placeholder={ph} className={pill} />
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-violet-500" />
                        <span className="text-sm font-bold text-slate-700 dark:text-white">Careers &amp; Bootcamp</span>
                        <a href="https://docs.google.com/forms" target="_blank" rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
                          New Form <ExternalLink size={10} />
                        </a>
                      </div>
                      <div>
                        <label className={lbl}>Careers Form URL</label>
                        <input type="url" {...register("careersLink")} placeholder="https://forms.gle/..." className={pill} />
                      </div>
                      <div>
                        <label className={lbl}>Bootcamp Ribbon URL <span className="normal-case font-normal text-slate-400">(Schools page hero)</span></label>
                        <input type="url" {...register("bootcampLink")} placeholder="https://forms.gle/bPqn2u..." className={pill} />
                        <p className="text-[11px] text-slate-400 mt-1.5 ml-1">Drives the &quot;Free AI &amp; Robotics Bootcamp&quot; ribbon on the Schools page.</p>
                      </div>
                      <div>
                        <label className={lbl}>Robotics Champ. Form (Schools) <span className="normal-case font-normal text-slate-400">(School page hero)</span></label>
                        <input type="url" {...register("roboticsChampionshipLink")} placeholder="https://forms.gle/..." className={pill} />
                        <p className="text-[11px] text-slate-400 mt-1.5 ml-1">Form link used for schools registering teams.</p>
                      </div>
                      <div>
                        <label className={lbl}>Robotics Champ. Form (Individual) <span className="normal-case font-normal text-slate-400">(Home & Kids pg)</span></label>
                        <input type="url" {...register("individualChampionshipLink")} placeholder="https://forms.gle/..." className={pill} />
                        <p className="text-[11px] text-slate-400 mt-1.5 ml-1">Form link used for individual student registrations.</p>
                      </div>
                    </div>
                  </SectionCard>
                  <StickyBar loading={loading} label="Links" onDiscard={loadSettings} />
                </form>
              </motion.div>
            )}

            {/* ── INTEGRATIONS & PAYMENTS ── */}
            {activeSection === "integrations" && (
              <motion.div key="integrations" {...fadeTab}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <SectionCard label="Integrations & Payments" icon={CreditCard} gradient="from-amber-400 to-orange-500">
                    {/* Google Sheets */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-1">
                        <LinkIcon className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-bold text-slate-700 dark:text-white">Google Sheets Integration</span>
                      </div>
                      <label className={lbl}>Webhook URL <span className="normal-case font-normal text-slate-400">(Enquiries auto-sync)</span></label>
                      <input type="url" {...register("sheetsWebhookUrl")} placeholder="https://script.google.com/macros/s/..." className={`${pill} font-mono`} />
                      <p className="text-[11px] text-slate-400 ml-1">Leave blank to disable. Needs a Google Apps Script Web App URL.</p>
                    </div>

                    {/* Payment Details */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-bold text-slate-700 dark:text-white">Payment Details</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Shown on student payment pages. Add UPI ID &amp; QR code for instant scanning.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={lbl}>UPI ID</label>
                          <input type="text" {...register("paymentDetails.upiId")} placeholder="yourid@upi" className={pill} />
                        </div>
                        <div>
                          <label className={`${lbl} flex items-center justify-between`}>
                            <span>UPI QR Code</span>
                            {qrPreviewImage && <span className="text-emerald-500 normal-case font-semibold text-[10px]">✓ Uploaded</span>}
                          </label>
                          <div className="flex items-center gap-3">
                            {qrPreviewImage && (
                              <div className="w-10 h-10 rounded-xl border border-amber-200 dark:border-amber-500/20 overflow-hidden relative bg-white shrink-0">
                                <Image src={qrPreviewImage} alt="QR" fill className="object-contain p-1" />
                              </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleQrSelect}
                              className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-50 dark:file:bg-amber-400/10 file:text-amber-700 dark:file:text-amber-400 hover:file:bg-amber-100" />
                          </div>
                        </div>
                        <div>
                          <label className={lbl}>Account Holder Name</label>
                          <input type="text" {...register("paymentDetails.accountName")} placeholder="PNT Academy" className={pill} />
                        </div>
                        <div>
                          <label className={lbl}>Bank Name</label>
                          <input type="text" {...register("paymentDetails.bankName")} placeholder="HDFC Bank" className={pill} />
                        </div>
                        <div>
                          <label className={lbl}>Account Number</label>
                          <input type="text" {...register("paymentDetails.accountNumber")} placeholder="50100XXXXXXX" className={pill} />
                        </div>
                        <div>
                          <label className={lbl}>IFSC Code</label>
                          <input type="text" {...register("paymentDetails.ifscCode")} placeholder="HDFC0001234" className={`${pill} uppercase`} />
                        </div>
                      </div>
                    </div>

                    {/* Payment Link Generator */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-bold text-slate-700 dark:text-white">Payment Link Generator</span>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ml-1">TOOL</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Generate a shareable payment link. Not saved to settings.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { l: "Course Name", v: linkCourse, fn: setLinkCourse, ph: "Robotics Basic", t: "text" },
                          { l: "Amount (₹)", v: linkAmount, fn: setLinkAmount, ph: "5000", t: "number" },
                          { l: "Client Name", v: linkClientName, fn: setLinkClientName, ph: "Rahul (optional)", t: "text" },
                        ].map(({ l, v, fn, ph, t }) => (
                          <div key={l}>
                            <label className={lbl}>{l}</label>
                            <input type={t} value={v} onChange={e => fn(e.target.value)} placeholder={ph} className={pill} />
                          </div>
                        ))}
                      </div>
                      {(linkCourse || linkAmount) && (
                        <div className="space-y-3 mt-4">
                          <label className={lbl}>Generated Link</label>
                          <div className="flex items-center gap-2">
                            <input readOnly value={generatedLink}
                              className="flex-1 px-5 py-3.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs focus:outline-none min-w-0" />
                            <motion.button type="button" whileTap={{ scale: 0.95 }}
                              onClick={() => { navigator.clipboard.writeText(generatedLink); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); }}
                              className={`shrink-0 px-5 py-3.5 rounded-full font-bold text-sm transition-all ${linkCopied ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50"}`}
                            >
                              {linkCopied ? "✓ Copied" : "Copy"}
                            </motion.button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <a href={`https://wa.me/?text=${encodeURIComponent(`Payment link for ${linkCourse || "your course"}: ${generatedLink}`)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full text-xs shadow-lg shadow-green-500/20">
                              📱 Share via WhatsApp
                            </a>
                            <button type="button" onClick={() => { setLinkCourse(""); setLinkAmount(""); setLinkClientName(""); }}
                              className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold rounded-full text-xs transition-colors">
                              Clear
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </SectionCard>
                  <StickyBar loading={loading} label="Integrations & Payments" onDiscard={loadSettings} />
                </form>
              </motion.div>
            )}

            {/* ── AI KNOWLEDGE ── */}
            {activeSection === "ai" && (
              <motion.div key="ai" {...fadeTab}>
                <SectionCard label="AI Knowledge" icon={Brain} gradient="from-violet-500 to-fuchsia-500">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload a company .txt document to make the AI chatbot smarter. It answers visitor questions using this context.
                  </p>
                  {kbFileName && (
                    <div className="flex items-center justify-between p-4 bg-violet-50 dark:bg-violet-500/10 rounded-2xl border border-violet-100 dark:border-violet-500/20">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-violet-500 shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{kbFileName}</p>
                          <p className="text-xs text-slate-500">{(kbTextLength / 1000).toFixed(1)} KB loaded</p>
                        </div>
                      </div>
                      <button type="button"
                        onClick={async () => {
                          if (!confirm("Remove knowledge base? The AI will lose this context.")) return;
                          await fetch("/api/admin/knowledge-base", { method: "DELETE" });
                          setKbFileName(""); setKbTextLength(0); setKbStatus("Removed.");
                        }}
                        className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div>
                    <label className={lbl}>Upload Company Document (.txt)</label>
                    <input type="file" accept=".txt,text/plain" disabled={kbUploading}
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setKbUploading(true); setKbStatus("Reading…");
                        try {
                          const text = await f.text();
                          if (!text.trim()) throw new Error("File is empty");
                          setKbStatus("Uploading…");
                          const res = await fetch("/api/admin/knowledge-base", {
                            method: "POST", headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ knowledgeBaseText: text, knowledgeBaseFileName: f.name }),
                          });
                          if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Upload failed"); }
                          const result = await res.json();
                          setKbFileName(result.fileName); setKbTextLength(result.textLength);
                          setKbStatus("✅ Knowledge base updated!");
                        } catch (err: unknown) {
                          setKbStatus(`❌ ${err instanceof Error ? err.message : "Error"}`);
                        } finally { setKbUploading(false); }
                      }}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-violet-100 dark:file:bg-violet-500/10 file:text-violet-700 dark:file:text-violet-400 hover:file:bg-violet-200 disabled:opacity-50"
                    />
                    <p className="text-[11px] text-slate-400 mt-2">💡 Have a .docx? Save it as .txt in Word or Google Docs first.</p>
                    {kbStatus && <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{kbUploading ? "⏳ " : ""}{kbStatus}</p>}
                  </div>
                </SectionCard>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {fileToCrop && (
        <ImageCropper file={fileToCrop.file} aspectRatio={1} onCropComplete={handleCropComplete} onCancel={() => setFileToCrop(null)} />
      )}
    </div>
  );
}

// ── Sticky save bar ──
function StickyBar({ loading, label, onDiscard }: { loading: boolean; label: string; onDiscard: () => void }) {
  return (
    <div className="sticky bottom-4 z-10">
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl px-5 py-4
          shadow-2xl shadow-slate-300/30 dark:shadow-indigo-900/20
          border border-slate-200/60 dark:border-slate-700/50 flex items-center gap-4"
      >
        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-black text-slate-800 dark:text-white">Save {label}</span>
          <span className="text-[11px] text-slate-400">Changes take effect immediately after saving</span>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <button type="button" onClick={onDiscard}
            className="px-5 py-2.5 rounded-full font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm">
            Discard
          </button>
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-7 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-black rounded-full shadow-xl shadow-indigo-400/30 dark:shadow-indigo-900/40 transition-all text-sm disabled:opacity-60">
            <Save className="w-4 h-4" />
            {loading ? "Saving…" : "Save Settings"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
