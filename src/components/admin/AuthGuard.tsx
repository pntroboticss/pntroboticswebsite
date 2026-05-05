"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If Firebase is not configured, show a helpful message instead of crashing
        if (!auth) {
            console.error("Firebase is not initialized. Please ensure NEXT_PUBLIC_FIREBASE_* environment variables are set.");
            setLoading(false);
            return;
        }

        // Exclude the login page from the protection loop
        if (pathname === "/admin/login") {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push("/admin/login");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user && pathname !== "/admin/login") {
        return null; // Prevents flashing before redirect
    }

    return <>{children}</>;
}
