"use client";

import { useState, useEffect } from "react";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setShow(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="bg-zinc-900/95 backdrop-blur-md border border-zinc-800 text-zinc-300 p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 pointer-events-auto">
        <div className="flex-1 text-sm leading-relaxed">
          <p className="font-semibold text-white mb-1">We value your privacy</p>
          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={decline}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-sm font-semibold transition-all duration-200"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 text-sm font-semibold transition-all duration-200"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
