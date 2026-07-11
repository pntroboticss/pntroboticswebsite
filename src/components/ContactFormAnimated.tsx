"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Send, MapPin, Mail, Phone, Loader2, CheckCircle2, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function ContactFormAnimated() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "", _honeypot: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setIsSuccess(true);
                setFormData({ name: "", email: "", subject: "", message: "", _honeypot: "" });
                // Reset success state after 5 seconds
                setTimeout(() => setIsSuccess(false), 5000);
            } else {
                console.error("Failed to submit form");
            }
        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const fadeIn: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-400/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center"
                >
                    {/* Left side: Content */}
                    <div>
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-blue-700 bg-blue-100/50 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50 mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                            </span>
                            Let's Connect
                        </motion.div>

                        <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">
                            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">collaborate?</span>
                        </motion.h2>

                        <motion.p variants={fadeIn} className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                            Whether you have a question about our industrial automation solutions, need a consultation, or just want to say hello, we're here for you.
                        </motion.p>

                        <div className="space-y-6">
                            {[
                                { icon: Mail, title: "Email Us", details: "contact@pntsolutions.in" },
                                { icon: Phone, title: "Call Us", details: "+91 7977543839 / +91 8097643046" },
                                { icon: MapPin, title: "Visit Us", details: "Plot no. A115, Infinity Business Park, MIDC, Dombivli East, Kalyan, Maharashtra 421203" }
                            ].map((item, idx) => (
                                <motion.div key={idx} variants={fadeIn} className="flex items-center gap-5 group">
                                    <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:shadow-blue-500/20 group-hover:border-blue-500/30 transition-all duration-300">
                                        <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.details}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Embedded Google Map */}
                        <motion.div variants={fadeIn} className="mt-10">
                            <div className="w-full h-64 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg relative group bg-slate-100 dark:bg-slate-800">
                                <iframe
                                    src="https://maps.google.com/maps?q=Plot%20no.%20A115,%20Infinity%20Business%20Park,%20MIDC,%20Dombivli%20East,%20Kalyan,%20Maharashtra%20421203&t=&z=14&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 opacity-90 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal"
                                />
                            </div>
                            <div className="mt-4 flex justify-end">
                                <a
                                    href="https://maps.google.com/maps?q=Plot%20no.%20A115,%20Infinity%20Business%20Park,%20MIDC,%20Dombivli%20East,%20Kalyan,%20Maharashtra%20421203"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold text-sm rounded-full hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Open in Google Maps <MapPin className="w-4 h-4" />
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right side: Form */}
                    <motion.div variants={fadeIn} className="relative flex flex-col gap-8">
                        {/* Custom Project Button */}
                        <Link
                            href="/custom-project"
                            className="group relative w-full overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 to-purple-600 p-[2px] hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 block"
                        >
                            <div className="relative flex items-center justify-between gap-4 bg-white dark:bg-slate-900 px-8 py-6 rounded-[2rem] group-hover:bg-blue-50 dark:group-hover:bg-slate-800 transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                        <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Have any unique idea?</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">Click here for custom project requests</p>
                                    </div>
                                </div>
                                <div className="hidden sm:block">
                                    <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-400 text-sm font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        Start Project
                                    </span>
                                </div>
                            </div>
                        </Link>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-[2rem] blur-2xl opacity-20 dark:opacity-30 translate-y-4 pointer-events-none" />

                            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-8 md:p-12 rounded-[2rem] shadow-2xl overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {isSuccess ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", delay: 0.1 }}
                                                className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
                                            >
                                                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                                            </motion.div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                                            <p className="text-slate-600 dark:text-slate-400">Thank you for reaching out. Our team will get back to you shortly.</p>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onSubmit={handleSubmit}
                                            className="space-y-6"
                                        >
                                            {/* Honeypot Field - Hidden from humans, filled by bots */}
                                            <div className="hidden" aria-hidden="true">
                                                <label htmlFor="_honeypot">Leave this field empty</label>
                                                <input
                                                    type="text"
                                                    id="_honeypot"
                                                    name="_honeypot"
                                                    value={formData._honeypot}
                                                    onChange={handleChange}
                                                    tabIndex={-1}
                                                    autoComplete="off"
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Your Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        required
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subject</label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    required
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400"
                                                    placeholder="How can we help?"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Message</label>
                                                <textarea
                                                    rows={5}
                                                    name="message"
                                                    required
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-400 resize-none"
                                                    placeholder="Tell us about your project..."
                                                />
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full relative flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-lg overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {/* Hover effect background */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Send Message
                                                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                        </>
                                                    )}
                                                </span>
                                            </motion.button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
