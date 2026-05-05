import Link from "next/link";
import { getAdminSettings } from "@/lib/actions/db";
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export default async function Footer() {
    const settings = await getAdminSettings();
    const socialLinks = settings?.socialLinks || {
        instagram: "#",
        linkedin: "#",
        twitter: "#",
        youtube: "#"
    };

    return (
        <footer className="py-16 border-t border-slate-900/10 dark:border-white/10 bg-slate-100 dark:bg-slate-950 text-center text-slate-800 dark:text-slate-500 transition-colors duration-500">
            <div className="container mx-auto px-4">
                <div className="flex justify-center items-center gap-4 mb-6">
                    {socialLinks.instagram && (
                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                            <Instagram size={20} />
                        </a>
                    )}
                    {socialLinks.linkedin && (
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                            <Linkedin size={20} />
                        </a>
                    )}
                    {socialLinks.twitter && (
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                            <Twitter size={20} />
                        </a>
                    )}
                    {socialLinks.youtube && (
                        <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                            <Youtube size={20} />
                        </a>
                    )}
                </div>

                <p className="text-sm font-medium">© 2026 PNT Robotics. All rights reserved.</p>

                <Link href="/admin" className="text-xs mt-4 inline-block hover:text-blue-600 transition-colors opacity-40 hover:opacity-100">
                    Admin Portal
                </Link>
            </div>
        </footer>
    );
}
