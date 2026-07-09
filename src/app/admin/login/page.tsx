"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, Mail, Lock, ArrowLeft, Loader2, UserPlus, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Stop the auto-redirect to avoid trapping the back button
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsAlreadyLoggedIn(true);
            }
        });
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setLoading(true);

        try {
            if (isSignUp) {
                // Handle Registration
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;

                if (data?.session) {
                    // Auto-login succeeded
                    router.push("/admin");
                } else {
                    // Requires email verification
                    setSuccessMsg("Account created! If your Supabase requires email confirmation, please check your inbox. Otherwise, you can try signing in now.");
                    setIsSignUp(false);
                }
            } else {
                // Handle Login
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                
                router.push("/admin");
            }
        } catch (err: any) {
            console.error("Auth Error:", err);
            
            // Provide helpful feedback for common Supabase errors
            if (err.message.includes("rate limit")) {
                setError("Too many attempts. If you already created an account, try signing in now (switched automatically). Otherwise, wait an hour.");
                setIsSignUp(false); // Automatically switch to sign in
            } else if (err.message.includes("Email not confirmed")) {
                setError("Please confirm your email address. (Or disable 'Confirm Email' in your Supabase Auth settings).");
            } else if (err.message.includes("Invalid login")) {
                setError("Invalid email or password.");
            } else {
                setError(err.message || "An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500/30 relative">
            {/* Background Details */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link 
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 px-4 sm:px-0"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to website
                </Link>

                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-white dark:bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                        <Image 
                            src="/PNT Robo logo.png" 
                            alt="PNT Robotics Logo" 
                            fill
                            sizes="80px"
                            className="object-contain p-2"
                        />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
                    {isAlreadyLoggedIn ? "Welcome Back" : isSignUp ? "Create Admin Account" : "Admin Portal"}
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    {isAlreadyLoggedIn ? "You are securely signed in" : isSignUp ? "Register your master access credentials" : "Sign in to manage PNT Robotics"}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
                <div className="bg-slate-800/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-700/50">
                    
                    {isAlreadyLoggedIn ? (
                        <div className="text-center py-8">
                            <ShieldCheck className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-white mb-6">You are already signed in.</h3>
                            <button
                                onClick={() => router.push("/admin")}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all"
                            >
                                Continue to Dashboard
                                <ArrowLeft className="w-4 h-4 rotate-180" />
                            </button>
                        </div>
                    ) : (
                        <>
                    
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/30 text-red-200 text-sm">
                            <p className="font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                Error
                            </p>
                            <p className="mt-1 opacity-90">{error}</p>
                        </div>
                    )}

                    {successMsg && (
                        <div className="mb-6 p-4 rounded-xl bg-green-900/30 border border-green-500/30 text-green-200 text-sm">
                            <p className="font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Success
                            </p>
                            <p className="mt-1 opacity-90">{successMsg}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-slate-300">
                                Email address
                            </label>
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-600 bg-slate-900/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                                    placeholder="admin@pntrobotics.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300">
                                Password
                            </label>
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-600 bg-slate-900/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            {/* Button subtle highlight effect */}
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                                    {isSignUp ? 'Create Account' : 'Sign In'}
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-slate-800 text-slate-400">
                                    {isSignUp ? "Already have an account?" : "Need admin access?"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setError("");
                                    setSuccessMsg("");
                                }}
                                className="w-full inline-flex justify-center py-3 px-4 border border-slate-600 rounded-xl shadow-sm bg-transparent text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none transition-colors"
                            >
                                {isSignUp ? "Switch to Sign In" : "Switch to Create Account"}
                            </button>
                        </div>
                    </div>
                    </>)}
                </div>
                
                <p className="text-center mt-8 text-xs text-slate-500 font-medium">
                    Powered by Supabase Auth
                </p>
            </div>
        </div>
    );
}
