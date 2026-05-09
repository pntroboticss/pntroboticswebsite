"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Send, MapPin, Mail, Phone, CheckCircle, Loader2, MessageCircle, Briefcase, ExternalLink, Instagram, Linkedin, Twitter, Youtube, ChevronDown, Sparkles, ArrowRight, Copy, Clock } from "lucide-react";

interface Faq {
    _id: string;
    question: string;
    answer: string;
    order: number;
}

const SUBJECTS = [
    "Product Enquiry",
    "Partnership / Collaboration",
    "Defense & R&D Projects",
    "AMR / Humanoid Solutions",
    "Careers",
    "General",
];

const DETAILS = [
    {
        icon: MapPin,
        label: "Visit Our Lab",
        lines: ["Dombivli,", "Maharashtra-421203"],
        color: "from-blue-500 to-cyan-500",
        textColor: "text-blue-500 dark:text-blue-400",
        href: "https://www.google.com/maps?q=Dombivli,+Maharashtra+421203",
    },
    {
        icon: Mail,
        label: "Drop Us a Line",
        lines: ["pratik@pntsolutions.in"],
        color: "from-purple-500 to-pink-500",
        textColor: "text-purple-500 dark:text-purple-400",
        href: "mailto:pratik@pntsolutions.in?subject=Website%20Enquiry&body=Hi%20PNT%20Robotics,%0A%0AI%20am%20interested%20in%20learning%20more%20about...",
    },
    {
        icon: Phone,
        label: "Speak to Our Team",
        lines: ["+91 79775 43839"],
        color: "from-teal-500 to-emerald-500",
        textColor: "text-teal-500 dark:text-teal-400",
        href: "tel:+917977543839",
    },
    {
        icon: ExternalLink,
        label: "Website",
        lines: ["www.pntsolutions.in"],
        color: "from-green-500 to-lime-500",
        textColor: "text-green-500 dark:text-green-400",
        href: "https://www.pntsolutions.in",
    },
];

/* ── Animation Presets ── */
const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    }),
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const cardHover = {
    rest: { y: 0, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" },
    hover: { y: -6, boxShadow: "0 20px 60px rgba(59,130,246,0.15)" },
};

/* ── Section Wrapper ── */
function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default function ContactClient({ faqs, settings }: { faqs: Faq[]; settings?: any }) {
    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "General", message: "" });
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [openFaq, setOpenFaq] = useState<string | null>(null);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const socialLinks = settings?.socialLinks || { instagram: "#", linkedin: "#", twitter: "#", youtube: "#" };
    const careersLink = settings?.careersLink || "mailto:careers@pntrobotics.com?subject=Job%20Application";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            setStatus(res.ok ? "sent" : "error");
        } catch {
            setStatus("error");
        }
    };

    const inputBase = "w-full px-5 py-3.5 rounded-2xl border bg-white/80 dark:bg-white/5 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 outline-none";
    const inputFocus = "border-blue-500/50 dark:border-blue-400/50 ring-4 ring-blue-500/10 dark:ring-blue-400/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]";
    const inputRest = "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20";

    return (
        <div className="relative">
            <Navbar />
            <main className="min-h-screen relative text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500">

                {/* ═══════ HERO ═══════ */}
                <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
                    {/* Decorative gradient orbs */}
                    <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-400/20 mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">We&apos;d Love To Hear From You</span>
                        </motion.div>

                        <motion.h1
                            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-none"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <span className="text-slate-900 dark:text-white">Start Your </span>
                            <span className="relative">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x">
                                    Journey
                                </span>
                                <motion.span
                                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ originX: 0 }}
                                />
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                             From industrial automation to custom robotics — tell us your project needs and our engineers will get back to you.
                        </motion.p>

                        {/* Quick action pills */}
                        <motion.div
                            className="flex flex-wrap items-center justify-center gap-3 mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                                {[
                                { label: "WhatsApp Us", href: "https://wa.me/917977543839", icon: MessageCircle, color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/20" },
                                { label: "Call Now", href: "tel:+917977543839", icon: Phone, color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 hover:bg-teal-500/20" },
                                { label: "Email", href: "mailto:pratik@pntsolutions.in", icon: Mail, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20" },
                            ].map((action) => (
                                <a
                                    key={action.label}
                                    href={action.href}
                                    target={action.href.startsWith("http") ? "_blank" : undefined}
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-300 ${action.color}`}
                                >
                                    <action.icon className="w-4 h-4" />
                                    {action.label}
                                </a>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ═══════ CONTACT GRID ═══════ */}
                <section className="pb-16 sm:pb-24 container mx-auto px-4 max-w-7xl">
                    <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">

                        {/* ── LEFT COLUMN (2/5) ── */}
                        <AnimatedSection className="lg:col-span-2 space-y-5">

                            {/* Who we serve */}
                            <motion.div
                                className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-3xl p-6 shadow-sm"
                                variants={cardHover}
                                initial="rest"
                                whileHover="hover"
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <h3 className="font-black text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    Trusted By
                                </h3>
                                <motion.div className="space-y-2.5" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                                    {["Manufacturing Companies", "Defense & Government", "Hospitals & Healthcare", "Corporate & Enterprise", "R&D Partners"].map((item, i) => (
                                        <motion.div key={item} variants={fadeUp} custom={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 text-sm group">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shrink-0 group-hover:scale-150 transition-transform" />
                                            <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>

                            {/* Contact detail cards */}
                            <motion.div
                                className="space-y-3"
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                {DETAILS.map(({ icon: Icon, label, lines, color, textColor, href }, i) => (
                                    <motion.a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variants={fadeUp}
                                        custom={i}
                                        className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-2xl p-4 shadow-sm flex items-start gap-4 group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10 block relative overflow-hidden"
                                    >
                                        {/* Hover gradient sweep */}
                                        <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.08] transition-opacity duration-500`} />
                                        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{label}</p>
                                            <div className="space-y-0.5">
                                                {lines.map((line, j) => (
                                                    <p key={j} className={`text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:${textColor} transition-colors leading-snug`}>
                                                        {line}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 ml-auto mt-3 shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                    </motion.a>
                                ))}
                            </motion.div>


                        </AnimatedSection>

                        {/* ── RIGHT COLUMN (3/5) ── */}
                        <AnimatedSection className="lg:col-span-3 space-y-8" delay={0.15}>

                            {/* Form Card */}
                            <div className="relative overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl dark:shadow-2xl dark:shadow-blue-500/5">
                                {/* Decorative gradient corner */}
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                                {status === "sent" ? (
                                    <motion.div
                                        className="flex flex-col items-center justify-center py-16 text-center relative z-10"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    >
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
                                            className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mb-6 shadow-2xl shadow-green-500/30"
                                        >
                                            <CheckCircle className="w-10 h-10 text-white" />
                                        </motion.div>
                                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">We&apos;ve Got It! 🎉</h3>
                                        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                                            Your message is on its way to our team. Expect a personal response within 24 hours — we don&apos;t do auto-replies.
                                        </p>
                                        <button onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", subject: "General", message: "" }); }}
                                            className="mt-8 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95">
                                            Send Another Message
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                        <div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">Tell Us What You Need</h2>
                                             <p className="text-sm text-slate-500 dark:text-slate-400">Whether it&apos;s a product demo, a defense project, or a partnership — share the details and we&apos;ll get back to you fast.</p>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name *</label>
                                                <input required name="name" value={form.name} onChange={handleChange}
                                                    onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
                                                    placeholder="Rahul Sharma"
                                                    className={`${inputBase} ${focusedField === "name" ? inputFocus : inputRest}`} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email *</label>
                                                <input required type="email" name="email" value={form.email} onChange={handleChange}
                                                    onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                                                    placeholder="rahul@company.com"
                                                    className={`${inputBase} ${focusedField === "email" ? inputFocus : inputRest}`} />
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone</label>
                                                <input name="phone" value={form.phone} onChange={handleChange}
                                                    onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)}
                                                    placeholder="+91 98765 43210"
                                                    className={`${inputBase} ${focusedField === "phone" ? inputFocus : inputRest}`} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subject</label>
                                                <select name="subject" value={form.subject} onChange={handleChange}
                                                    onFocus={() => setFocusedField("subject")} onBlur={() => setFocusedField(null)}
                                                    className={`${inputBase} ${focusedField === "subject" ? inputFocus : inputRest}`}>
                                                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Message *</label>
                                            <textarea required name="message" value={form.message} onChange={handleChange} rows={5}
                                                onFocus={() => setFocusedField("message")} onBlur={() => setFocusedField(null)}
                                                placeholder="Please provide details about your robotics requirements or project scope."
                                                className={`${inputBase} resize-none ${focusedField === "message" ? inputFocus : inputRest}`}
                                            />
                                        </div>

                                        {status === "error" && (
                                            <motion.p
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="text-sm text-red-500 font-medium flex items-center gap-2"
                                            >
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                                Something went wrong. Please try again or email us directly.
                                            </motion.p>
                                        )}

                                        <motion.button
                                            type="submit"
                                            disabled={status === "sending"}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider relative overflow-hidden group"
                                        >
                                            {/* Shine sweep */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                            {status === "sending" ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> Send Message</>}
                                        </motion.button>
                                    </form>
                                )}
                            </div>

                        </AnimatedSection>
                    </div>
                </section>

                {/* ═══════ FAQ SECTION ═══════ */}
                {faqs.length > 0 && (
                    <section className="pb-16 sm:pb-24 container mx-auto px-4 max-w-6xl relative z-20">
                        <AnimatedSection delay={0.2}>
                            <div className="bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-xl dark:shadow-2xl dark:shadow-purple-500/5 relative overflow-hidden">
                                {/* Decorative elements inside FAQ */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mt-32 -mr-32" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mb-32 -ml-32" />

                                <div className="text-center mb-10 relative z-10">
                                    <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg mb-6 shadow-purple-500/30">
                                        <MessageCircle className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">
                                        Frequently Asked Questions
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400">Everything you need to know before contacting us.</p>
                                </div>

                                <motion.div className="grid md:grid-cols-2 gap-4 relative z-10 items-start" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                                    {faqs.map((faq, i) => (
                                        <motion.div
                                            key={faq._id}
                                            variants={fadeUp}
                                            custom={i}
                                            className={`border rounded-2xl overflow-hidden transition-all duration-500 ${
                                                openFaq === faq._id
                                                    ? "border-blue-400/50 dark:border-blue-400/30 bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-800/80 shadow-xl shadow-blue-500/10 scale-[1.02] -translate-y-1 relative z-10"
                                                    : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md"
                                            }`}
                                        >
                                            <button
                                                onClick={() => setOpenFaq(openFaq === faq._id ? null : faq._id)}
                                                className="w-full flex items-center justify-between p-5 text-left transition-colors focus:outline-none"
                                            >
                                                <span className={`font-bold pr-4 ${openFaq === faq._id ? "text-blue-600 dark:text-blue-400" : "text-slate-800 dark:text-slate-200"}`}>{faq.question}</span>
                                                <motion.div
                                                    animate={{ rotate: openFaq === faq._id ? 180 : 0 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${openFaq === faq._id ? "border-blue-200 bg-blue-100 text-blue-600 dark:border-blue-900 dark:bg-blue-900/50 dark:text-blue-400" : "border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900"}`}
                                                >
                                                    <ChevronDown className="w-5 h-5" />
                                                </motion.div>
                                            </button>
                                            <AnimatePresence>
                                                {openFaq === faq._id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-5 pb-5 pt-2">
                                                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap border border-slate-100 dark:border-slate-800/50 shadow-inner">
                                                                {faq.answer}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </AnimatedSection>
                    </section>
                )}

                {/* ═══════ BOTTOM CARDS (24h & Careers) ═══════ */}
                <section className="pb-16 sm:pb-24 container mx-auto px-4 max-w-6xl relative z-20">
                    <div className="grid md:grid-cols-2 gap-8 items-stretch">
                        {/* Response time + Social */}
                        <AnimatedSection delay={0.3} className="h-full">
                            <div className="h-full relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-10 text-white shadow-2xl shadow-blue-500/20">
                                {/* Decorative circles */}
                                <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-xl" />
                                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-lg" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Clock className="w-5 h-5 opacity-60" />
                                        <p className="text-sm font-bold uppercase tracking-widest opacity-60">Average Response</p>
                                    </div>
                                    <p className="text-6xl font-black">&lt; 24h</p>
                                    <p className="text-base opacity-80 mt-4 mb-8">That&apos;s our average reply time. Every enquiry matters to us — no auto-replies, just real people.</p>

                                    <div className="pt-6 border-t border-white/20 mt-auto">
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-4">Follow Us</p>
                                        <div className="flex items-center gap-3">
                                            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/10 hover:bg-gradient-to-tr hover:from-amber-400 hover:via-pink-500 hover:to-purple-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"><Instagram className="w-5 h-5 text-white" /></a>
                                            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/10 hover:bg-[#0A66C2] transition-all duration-300 hover:scale-110 hover:shadow-lg"><Linkedin className="w-5 h-5 text-white" /></a>
                                            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/10 hover:bg-black transition-all duration-300 hover:scale-110 hover:shadow-lg"><Twitter className="w-5 h-5 text-white" /></a>
                                            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/10 hover:bg-[#FF0000] transition-all duration-300 hover:scale-110 hover:shadow-lg"><Youtube className="w-5 h-5 text-white" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Careers */}
                        <AnimatedSection delay={0.4} className="h-full">
                            <motion.div
                                className="h-full bg-white/80 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-xl dark:shadow-2xl dark:shadow-purple-500/5 group hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-all duration-300 flex flex-col justify-center"
                                variants={cardHover}
                                initial="rest"
                                whileHover="hover"
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-500/20">
                                        <Briefcase className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-black text-2xl text-slate-800 dark:text-white">Careers & Openings</h3>
                                </div>
                                 <p className="text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                     Passionate about robotics, AI, or industrial engineering? We&apos;re growing fast and hiring hardware engineers, software developers, and business development professionals.
                                 </p>
                                <a href={careersLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-base font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group/link mt-auto w-fit px-6 py-3 rounded-full bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20">
                                    Apply Now
                                    <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                                </a>
                            </motion.div>
                        </AnimatedSection>
                    </div>
                </section>
            </main>
        </div>
    );
}
