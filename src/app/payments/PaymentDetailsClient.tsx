"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    Copy, Check, QrCode, Landmark, Landmark as Bank, User, Hash, ScanLine,
    Sparkles, MessageCircle, ClipboardList, ShieldCheck, ArrowRight,
    Smartphone, CheckCircle, Send, IndianRupee,
} from "lucide-react";

/* ── Types ── */
interface PaymentDetailsClientProps {
    details: {
        upiId?: string;
        upiQrCodeBase64?: string;
        accountName?: string;
        accountNumber?: string;
        ifscCode?: string;
        bankName?: string;
    } | null;
    amount?: string;
    course?: string;
    clientName?: string;
    whatsappNumber?: string;
}

/* ── Animation presets (matching ContactClient) ── */
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

/* ── Section wrapper (matching ContactClient) ── */
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

/* ── Process Steps Data ── */
const PROCESS_STEPS = [
    {
        icon: MessageCircle,
        title: "Contact Us",
        desc: "Reach out via WhatsApp, call, or our contact form to discuss your learning goals.",
        color: "from-green-500 to-emerald-500",
        iconBg: "bg-green-500/10 dark:bg-green-500/20",
        iconColor: "text-green-600 dark:text-green-400",
    },
    {
        icon: ClipboardList,
        title: "Personalized Plan",
        desc: "We understand your needs and craft the perfect learning path tailored for you.",
        color: "from-blue-500 to-cyan-500",
        iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
        iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
        icon: ShieldCheck,
        title: "Secure Payment",
        desc: "Complete your enrollment with a quick, zero-commission UPI or bank transfer.",
        color: "from-purple-500 to-pink-500",
        iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
        iconColor: "text-purple-600 dark:text-purple-400",
    },
];

/* ══════════════════════════════════════════════════════════════════════════════ */
export default function PaymentDetailsClient({ details, amount, course, clientName, whatsappNumber = "919326014648" }: PaymentDetailsClientProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [utrNumber, setUtrNumber] = useState("");
    const [showUtrInput, setShowUtrInput] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [ticketId, setTicketId] = useState<string>('');

    /* ── Link Expiration Timer (15 mins) ── */
    const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!amount) return; // No timer if no amount is provided (not a custom link)
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [amount]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    /* ── Send payment confirmation email to admin ── */
    const handlePaymentConfirm = async () => {
        if (!utrNumber.trim() || utrNumber.trim().length < 2) return;
        setIsSubmitting(true);
        
        // Generate a random ticket ID like PNT-A1B2C3
        const newTicketId = `PNT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setTicketId(newTicketId);

        try {
            await fetch('/api/payments/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName: clientName || 'Not provided',
                    courseName: course || 'Not specified',
                    amount: amount?.toString() || 'Not specified',
                    queryMessage: utrNumber.trim(),
                    ticketId: newTicketId,
                }),
            });
            setSubmitStatus('success');
        } catch {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopy = (text: string, fieldId: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // Construct UPI URL with optional amount
    const accountName = details?.accountName || "PNT Academy";
    const upiId = details?.upiId || "";
    // Some apps break if pn is an email and the @ is URL encoded to %40
    const safeAccountNameQR = encodeURIComponent(accountName).replace(/%40/g, '@');
    
    let baseUpiUrl = "";
    if (upiId) {
        baseUpiUrl = `upi://pay?pa=${upiId}&pn=${safeAccountNameQR}`;
        if (amount) baseUpiUrl += `&am=${amount}`;
        baseUpiUrl += `&cu=INR`;
    }
    const upiUrl = baseUpiUrl;
    const qrCodeUrl = upiUrl
        ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}&margin=10`
        : "";

    const hasBankDetails = details?.accountNumber || details?.ifscCode;
    const hasPaymentDetails = details && (details.upiId || details.accountNumber);

    // Format amount for display
    const formattedAmount = amount ? `₹${parseInt(amount).toLocaleString("en-IN")}` : null;

    // WhatsApp confirmation message
    const buildWhatsAppUrl = () => {
        const parts = [
            `Hi PNT Academy, I have a query regarding my payment.`,
            ticketId ? `Ticket ID: *${ticketId}*` : "",
            formattedAmount ? `Amount: ${formattedAmount}` : "",
            course ? `Course: ${course.replace(/\+/g, " ")}` : "",
            clientName ? `Name: ${clientName.replace(/\+/g, " ")}` : "",
            utrNumber ? `Query/Issue: ${utrNumber}` : "",
            ``,
            `*I will attach a screenshot of my transaction / issue here.*`,
            `Please assist me with this.`,
        ].filter(Boolean).join("\n");
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(parts)}`;
    };

    // Build UPI intent URL — uses universal upi://pay scheme (same as QR)
    // App-specific schemes (tez://, phonepe://) fail from web browsers
    const buildUpiIntentUrl = () => {
        if (!upiId) return "#";
        const amountFormatted = amount ? parseFloat(amount).toFixed(2) : null;
        // Some UPI apps break if the pn (payee name) is an email and the @ is URL encoded to %40
        const safeAccountName = encodeURIComponent(accountName).replace(/%40/g, '@');
        
        let url = `upi://pay?pa=${upiId}&pn=${safeAccountName}`;
        if (amountFormatted) url += `&am=${amountFormatted}`;
        url += `&cu=INR`;
        return url;
    };

    return (
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
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Secure &amp; Zero Commission</span>
                    </motion.div>

                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-none"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="text-slate-900 dark:text-white">Complete Your </span>
                        <span className="relative">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x">
                                Enrollment
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

                    {/* Dynamic course + amount display */}
                    {(formattedAmount || course) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 inline-flex items-center gap-4 px-8 py-5 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 shadow-xl"
                        >
                            {course && (
                                <div className="text-left">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Course</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">{course.replace(/\+/g, " ")}</p>
                                </div>
                            )}
                            {course && formattedAmount && <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />}
                            {formattedAmount && (
                                <div className="text-left">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Amount</p>
                                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">{formattedAmount}</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    <motion.p
                        className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        {formattedAmount
                            ? "Scan the QR code below or transfer securely to our bank account. The link expires in 15 minutes."
                            : "Contact us first — we'll understand your goals, craft the perfect plan, and then share a personalized payment link."}
                    </motion.p>
                </div>
            </section>

            {/* ═══════ PROCESS FLOW ═══════ */}
            {!formattedAmount && (
                <section className="pb-16 sm:pb-24 container mx-auto px-4 max-w-5xl">
                    <AnimatedSection>
                        <h2 className="text-2xl sm:text-3xl font-black text-center text-slate-900 dark:text-white mb-12">
                            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Works</span>
                        </h2>
                        <motion.div
                            className="grid sm:grid-cols-3 gap-6"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {PROCESS_STEPS.map((step, i) => (
                                <motion.div
                                    key={step.title}
                                    variants={fadeUp}
                                    custom={i}
                                    className="relative bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10"
                                >
                                    {/* Step number */}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-lg">
                                        {i + 1}
                                    </div>

                                    <div className={`w-14 h-14 rounded-2xl ${step.iconBg} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                        <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                                    </div>

                                    <h3 className="text-lg font-black text-slate-800 dark:text-white mb-2">{step.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>

                                    {/* Connector arrow (not on last) */}
                                    {i < PROCESS_STEPS.length - 1 && (
                                        <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                                            <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatedSection>
                </section>
            )}

            {/* ═══════ PAYMENT METHODS ═══════ */}
            {/* ═══════ PAYMENT METHODS (Only show if link has amount and not expired) ═══════ */}
            {hasPaymentDetails && amount && !isExpired && (
                <section className="pb-16 sm:pb-24 container mx-auto px-4 max-w-5xl">
                    {/* Timer Badge */}
                    <AnimatedSection>
                        <div className="flex justify-center mb-8">
                            <div className="flex items-center gap-2 px-6 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-full shadow-sm">
                                <span className="animate-pulse text-xl">⏳</span>
                                <span className="text-amber-700 dark:text-amber-400 font-bold text-sm">
                                    Link expires in {formatTime(timeLeft)}
                                </span>
                            </div>
                        </div>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                        {/* ─── UPI QR CODE CARD ─── */}
                        <AnimatedSection>
                            <motion.div
                                className="relative group rounded-3xl p-1 overflow-hidden h-full"
                                variants={cardHover}
                                initial="rest"
                                whileHover="hover"
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                {/* Metallic Shimmer Border */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-transparent to-purple-400 dark:from-blue-600 dark:via-blue-900 dark:to-purple-900 opacity-50" />
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                <div className="relative bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[calc(1.5rem-4px)] p-8 sm:p-10 border border-white/20 dark:border-white/10 shadow-2xl h-full flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-500/20">
                                        <QrCode className="w-8 h-8" />
                                    </div>

                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Scan & Pay</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2">
                                        {formattedAmount ? `Pay ${formattedAmount} instantly` : "Supports all UPI apps"}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-8">GPay • PhonePe • Paytm • BHIM</p>

                                    {/* QR Code */}
                                    {details?.upiQrCodeBase64 || upiId ? (
                                        <div className="relative bg-white p-4 rounded-3xl shadow-lg border border-slate-100 mb-8 inline-block">
                                            <div className="absolute top-0 right-0 -m-3 bg-blue-600 text-white p-2 rounded-full shadow-lg shadow-blue-600/30">
                                                <ScanLine className="w-4 h-4" />
                                            </div>
                                            <div className="relative w-48 h-48 rounded-2xl overflow-hidden mx-auto">
                                                {details?.upiQrCodeBase64 && !amount ? (
                                                    <Image
                                                        src={details.upiQrCodeBase64}
                                                        alt="UPI QR Code"
                                                        fill
                                                        className="object-contain"
                                                    />
                                                ) : (
                                                    <Image
                                                        src={qrCodeUrl}
                                                        alt={`UPI QR Code${formattedAmount ? ` for ${formattedAmount}` : ""}`}
                                                        fill
                                                        className="object-contain"
                                                        unoptimized
                                                    />
                                                )}
                                            </div>
                                            {formattedAmount && (
                                                <div className="mt-3 px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-full">
                                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{formattedAmount}</span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-48 h-48 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center mb-8 mx-auto">
                                            <span className="text-slate-400 text-sm font-medium">No QR Available</span>
                                        </div>
                                    )}

                                    {/* Generic UPI Intent */}
                                    {upiUrl && (
                                        <div className="w-full mb-6">
                                            <a
                                                href={upiUrl}
                                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-95"
                                            >
                                                <Smartphone className="w-4 h-4" />
                                                Open Default UPI App
                                            </a>
                                        </div>
                                    )}

                                    {/* UPI ID with copy */}
                                    <div className="mt-auto w-full space-y-3">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left">Or send direct to UPI ID</div>
                                        <button
                                            onClick={() => handleCopy(upiId, 'upi')}
                                            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all group/btn"
                                        >
                                            <div className="text-left font-mono font-medium text-slate-800 dark:text-slate-200 text-sm truncate pr-4">
                                                {upiId || "Not Configured"}
                                            </div>
                                            <div className={`p-2 rounded-lg transition-colors ${copiedField === 'upi' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-white dark:bg-slate-900 text-slate-400 group-hover/btn:text-blue-500'}`}>
                                                {copiedField === 'upi' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatedSection>

                        {/* ─── BANK DETAILS CARD ─── */}
                        <AnimatedSection delay={0.15}>
                            <motion.div
                                className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-xl h-full"
                                variants={cardHover}
                                initial="rest"
                                whileHover="hover"
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="mb-10 flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                                        <Landmark className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Bank Transfer</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">NEFT / RTGS / IMPS</p>
                                    </div>
                                </div>

                                {!hasBankDetails ? (
                                    <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                                        Bank details have not been configured yet.
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {[
                                            { id: 'name', label: 'Account Name', value: details?.accountName, icon: User, isMono: false },
                                            { id: 'bank', label: 'Bank Name', value: details?.bankName, icon: Bank, isMono: false },
                                            { id: 'acc', label: 'Account Number', value: details?.accountNumber, icon: Hash, isMono: true },
                                            { id: 'ifsc', label: 'IFSC Code', value: details?.ifscCode, icon: ScanLine, isMono: true },
                                        ].map((field) => (
                                            <div key={field.id} className="group relative">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <field.icon className="w-4 h-4 text-slate-400" />
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{field.label}</label>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={field.value || "Not Set"}
                                                        className={`w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white rounded-xl py-3 pl-4 pr-12 focus:outline-none transition-all ${field.isMono ? 'font-mono text-sm tracking-wide' : 'font-medium'} ${!field.value ? 'opacity-50' : ''}`}
                                                    />
                                                    {field.value && (
                                                        <button
                                                            onClick={() => handleCopy(field.value!, field.id)}
                                                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${copiedField === field.id ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700'}`}
                                                            title="Copy to clipboard"
                                                        >
                                                            {copiedField === field.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Amount reminder in bank transfer */}
                                {formattedAmount && (
                                    <div className="mt-6 p-4 bg-amber-50/80 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 rounded-2xl flex items-center gap-3">
                                        <IndianRupee className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                                        <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                                            Transfer exactly <span className="font-black">{formattedAmount}</span> to complete your enrollment.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatedSection>
                    </div>
                </section>
            )}

            {/* Expired State */}
            {hasPaymentDetails && amount && isExpired && (
                <section className="pb-16 sm:pb-24 container mx-auto px-4 max-w-3xl">
                    <AnimatedSection>
                        <div className="text-center p-12 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-3xl shadow-lg">
                            <span className="text-4xl block mb-4">⏱️</span>
                            <h2 className="text-2xl font-black text-amber-700 dark:text-amber-400 mb-2">Payment Link Expired</h2>
                            <p className="text-amber-600/80 dark:text-amber-500/80 font-medium">
                                For security, this payment link was only valid for 15 minutes. Please contact our team for a new link.
                            </p>
                        </div>
                    </AnimatedSection>
                </section>
            )}

            {/* No payment details configured */}
            {!hasPaymentDetails && (
                <section className="pb-16 sm:pb-24 container mx-auto px-4 max-w-3xl">
                    <AnimatedSection>
                        <div className="text-center p-12 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-3xl shadow-xl">
                            <Landmark className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-6" />
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Payment Details Unavailable</h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                The academy administrator has not configured payment details yet. Please contact support.
                            </p>
                        </div>
                    </AnimatedSection>
                </section>
            )}

            {/* ═══════ PAYMENT TICKET ═══════ */}
            {hasPaymentDetails && (
                <section className="pb-16 sm:pb-24 container mx-auto px-4 max-w-3xl">
                    <AnimatedSection delay={0.1}>
                        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 rounded-3xl p-8 sm:p-10 text-white shadow-2xl shadow-green-500/20">
                            {/* Decorative circles */}
                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-xl" />
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-lg" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 rounded-xl bg-white/20">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-2xl font-black">Payment Issue?</h2>
                                </div>
                                <p className="text-sm opacity-80 mb-6 max-w-lg">
                                    Have a query or facing an issue with your payment? Create a ticket and we will assist you immediately.
                                </p>

                                <AnimatePresence mode="wait">
                                    {!showUtrInput ? (
                                        <motion.button
                                            key="trigger"
                                            initial={{ opacity: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            onClick={() => setShowUtrInput(true)}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-sm"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            Raise Payment Ticket
                                        </motion.button>
                                    ) : (
                                        <motion.div
                                            key="input"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-3"
                                        >
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block">Your Query / Issue</label>
                                                <input
                                                    type="text"
                                                    value={utrNumber}
                                                    onChange={(e) => setUtrNumber(e.target.value)}
                                                    placeholder="Describe your payment issue..."
                                                    maxLength={150}
                                                    className="w-full px-5 py-3.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/50 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                                                />
                                                <p className="text-[10px] opacity-70 mt-1.5">Attach payment screenshots directly in WhatsApp on the next step.</p>
                                            </div>
                                            {submitStatus === 'success' ? (
                                                <div className="p-5 bg-white/20 rounded-xl text-center border border-white/30">
                                                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-300" />
                                                    <p className="font-black text-lg">Ticket Created!</p>
                                                    <div className="my-3 py-2 bg-black/20 rounded-lg">
                                                        <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Ticket ID</p>
                                                        <p className="font-mono text-xl font-bold tracking-wider text-green-300">{ticketId}</p>
                                                    </div>
                                                    <p className="text-xs opacity-90 mt-2">
                                                        Please click the WhatsApp button below to send us your screenshots and continue the chat.
                                                    </p>
                                                    <div className="mt-4 flex gap-2">
                                                        <a
                                                            href={buildWhatsAppUrl()}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-green-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-sm"
                                                        >
                                                            <Send className="w-4 h-4" />
                                                            Open WhatsApp
                                                        </a>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <a
                                                        href={buildWhatsAppUrl()}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => {
                                                            if (!utrNumber.trim() || utrNumber.trim().length < 2) {
                                                                e.preventDefault();
                                                                alert("Please enter a query before continuing.");
                                                                return;
                                                            }
                                                            handlePaymentConfirm();
                                                        }}
                                                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-green-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-sm"
                                                    >
                                                        <Send className="w-4 h-4" />
                                                        {isSubmitting ? 'Raising Ticket...' : 'Send via WhatsApp'}
                                                    </a>
                                                    <button
                                                        onClick={() => { setShowUtrInput(false); setUtrNumber(""); setSubmitStatus('idle'); setTicketId(""); }}
                                                        className="px-4 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </AnimatedSection>
                </section>
            )}

            {/* ═══════ TRUST SECTION ═══════ */}
            <section className="pb-8 container mx-auto px-4 max-w-3xl">
                <AnimatedSection>
                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium bg-emerald-50/80 dark:bg-emerald-500/10 px-6 py-3 rounded-xl border border-emerald-100 dark:border-emerald-500/20 mx-auto w-fit">
                        <ShieldCheck className="w-4 h-4" />
                        256-bit SSL Encrypted &amp; Verified • Zero Commission
                    </div>
                </AnimatedSection>
            </section>

            {/* ═══════ HELP CTA ═══════ */}
            <section className="pb-16 sm:pb-24 container mx-auto px-4 max-w-3xl">
                <AnimatedSection delay={0.1}>
                    <div className="relative overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-xl text-center group hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-all duration-300">
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Need Help?</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                                Haven&apos;t spoken with us yet? Contact us first — we&apos;ll help you choose the right course and share a personalized payment link.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all text-sm relative overflow-hidden group/btn"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                    <MessageCircle className="w-4 h-4" />
                                    Contact Us
                                </Link>
                                <a
                                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi PNT Academy, I have an enquiry about your courses.")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 font-bold rounded-xl hover:bg-green-500/20 transition-all text-sm"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp Us
                                </a>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </section>
        </main>
    );
}
