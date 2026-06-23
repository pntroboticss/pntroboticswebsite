import Link from "next/link";
import { getAdminSettings } from "@/lib/actions/db";
import { Instagram, Linkedin, MapPin, Mail, Phone, Globe, User } from "lucide-react";

export default async function Footer() {
    const settings = await getAdminSettings();
    const socialLinks = settings?.socialLinks || {
        instagram: "#",
        linkedin: "#"
    };

    return (
        <footer className="w-full py-16 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-slate-600 dark:text-slate-400">
                
                {/* Brand & Socials */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">PNT Robotics & Automation Solutions LLP</h3>
                    <p className="text-sm">Making human life simpler & safe with our robotic solutions.</p>
                    <div className="flex items-center gap-4 mt-4">
                        {socialLinks.instagram && (
                            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
                                <Instagram size={18} />
                            </a>
                        )}
                        {socialLinks.linkedin && (
                            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white">
                                <Linkedin size={18} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Contact Us</h4>
                    <div className="flex items-start gap-3 text-sm">
                        <MapPin size={18} className="text-cyan-600 dark:text-cyan-400 mt-0.5 shrink-0" />
                        <span>Dombivli, Maharashtra-421203</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Phone size={18} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span>+91 79775 43839</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Mail size={18} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <a href="mailto:pratik@pntsolutions.in" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">pratik@pntsolutions.in</a>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <Globe size={18} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <a href="https://www.pntsolutions.in" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">www.pntsolutions.in</a>
                    </div>
                </div>

                {/* Team & Admin */}
                <div className="flex flex-col gap-4 md:items-end">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Leadership</h4>
                    <div className="flex items-center gap-3 text-sm">
                        <User size={18} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span>Pratik Tirodkar, Founder</span>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 text-center text-sm text-slate-500 dark:text-slate-500">
                <Link href="/admin" className="hover:text-slate-800 dark:hover:text-slate-400 transition-colors">
                    © 2026 PNT Robotics & Automation Solutions LLP. All rights reserved.
                </Link>
            </div>
        </footer>
    );
}
