"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, CheckCircle2, Clock, XCircle, Star, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

type StatusResult = {
  applicantName: string;
  status: string;
  applicationType: string;
  appliedOn: string;
  shortId: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: JSX.Element; message: string }> = {
  Pending: {
    label: "Under Review",
    color: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800",
    icon: <Clock size={40} className="text-amber-500" />,
    message: "Your application is in our review queue. We'll reach out to you soon.",
  },
  Interview: {
    label: "Shortlisted / Interview",
    color: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200 dark:border-blue-800",
    icon: <Star size={40} className="text-blue-500" />,
    message: "Great news! You've been shortlisted. Please check your email for interview details.",
  },
  Accepted: {
    label: "Selected 🎉",
    color: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: <CheckCircle2 size={40} className="text-emerald-500" />,
    message: "Congratulations! You have been selected. Please check your email for next steps.",
  },
  Rejected: {
    label: "Not Moving Forward",
    color: "text-red-700 dark:text-red-300",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800",
    icon: <XCircle size={40} className="text-red-400" />,
    message: "Thank you for your interest. We won't be moving forward with your application at this time.",
  },
};

export default function ApplicationStatusPage() {
  const [inputId, setInputId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusResult | null>(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    const trimmed = inputId.trim();
    if (!trimmed) {
      setError("Please enter your Application ID.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/careers/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cfg = result ? (STATUS_CONFIG[result.status] ?? STATUS_CONFIG["Pending"]) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-slate-800">
        <Link href="/" className="flex items-center gap-3">
          <img src="/PNT%20Robo%20logo.png" alt="PNT Robotics" className="h-10 w-auto" />
        </Link>
        <Link href="/careers" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
          <ArrowLeft size={16} /> Back to Careers
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-8">
          {/* Title */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-5">
              <Search size={28} className="text-blue-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Check Application Status</h1>
            <p className="text-slate-400 text-sm">
              Enter the <strong className="text-slate-300">Application ID</strong> from your confirmation email to view your current status.
            </p>
          </div>

          {/* Input Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-2xl">
            <label className="block text-sm font-bold text-slate-300 mb-2">
              Application ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputId}
                onChange={(e) => { setInputId(e.target.value); setError(""); setResult(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                placeholder="e.g.  60EC34DD  or full UUID"
                maxLength={36}
                className="w-full bg-slate-800 border border-slate-700 focus:border-blue-500 rounded-2xl px-4 py-4 text-white placeholder-slate-500 font-mono text-sm outline-none transition-colors pr-12"
              />
              <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>

            {error && (
              <p className="mt-3 text-red-400 text-sm font-medium flex items-center gap-2">
                <XCircle size={15} /> {error}
              </p>
            )}

            <button
              onClick={handleCheck}
              disabled={loading}
              className="w-full mt-5 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-black text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Checking...</>
              ) : (
                <><Search size={18} /> Check Status</>
              )}
            </button>

            {/* Security badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-slate-600 text-xs">
              <ShieldCheck size={13} />
              <span>Your data is fetched securely. We never store your search.</span>
            </div>
          </div>

          {/* Result Card */}
          {result && cfg && (
            <div className={`rounded-3xl border p-7 space-y-5 ${cfg.bg} ${cfg.border} shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-300`}>
              {/* Status Icon + Badge */}
              <div className="flex flex-col items-center text-center gap-3">
                {cfg.icon}
                <div>
                  <span className={`text-xs font-black uppercase tracking-widest ${cfg.color}`}>
                    Application Status
                  </span>
                  <h2 className={`text-2xl font-black mt-1 ${cfg.color}`}>{cfg.label}</h2>
                </div>
              </div>

              {/* Divider */}
              <div className={`border-t ${cfg.border}`} />

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Applicant</div>
                  <div className={`font-bold ${cfg.color}`}>{result.applicantName}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">App ID</div>
                  <div className={`font-mono font-bold ${cfg.color}`}>{result.shortId}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Applied For</div>
                  <div className={`font-bold ${cfg.color}`}>{result.applicationType}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Applied On</div>
                  <div className={`font-bold ${cfg.color}`}>{result.appliedOn}</div>
                </div>
              </div>

              {/* Message */}
              <div className={`rounded-2xl p-4 border ${cfg.border} bg-white/30 dark:bg-black/10`}>
                <p className={`text-sm font-medium ${cfg.color}`}>{cfg.message}</p>
              </div>

              {result.status === "Rejected" && (
                <div className="text-center">
                  <Link href="/careers" className="text-sm text-slate-400 hover:text-white underline underline-offset-4 transition-colors">
                    View other openings →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
