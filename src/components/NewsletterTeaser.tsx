"use client";

export default function NewsletterTeaser() {
    return (
        <section className="py-24 relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-64 h-64 rounded-full bg-blue-500/10 dark:bg-blue-600/5 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-80 h-80 rounded-full bg-purple-500/10 dark:bg-purple-600/5 blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-16 text-center shadow-2xl flex flex-col items-center">
                    <span className="text-5xl mb-6 inline-block animate-bounce-slow">📰</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white transition-colors duration-500">
                        The Future of Learning, Delivered.
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 transition-colors duration-500">
                        Stay ahead of the curve. Be the first to read our upcoming blog featuring the latest tech happenings, robotics innovations, and stories from our most recent projects.
                    </p>

                    <form className="w-full max-w-md flex flex-col sm:flex-row gap-3" onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing! (This is a placeholder)"); }}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                        />
                        <button type="submit" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-colors shadow-lg">
                            Subscribe
                        </button>
                    </form>

                    <p className="text-sm text-slate-500 mt-6 italic">
                        No spam, just pure innovation. Our full engineering blog is launching soon.
                    </p>
                </div>
            </div>
        </section>
    );
}
