"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <motion.svg
                width="80"
                height="80"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
                {/* Gear shape */}
                <path
                    d="M50 30a20 20 0 1 0 0 40 20 20 0 0 0 0-40zm0-8c-2.2 0-4.3.2-6.3.5l-4.2-7.3a2 2 0 0 0-2.7-.9l-8 4.6a2 2 0 0 0-.8 2.7l4.2 7.3c-1.6 1.2-3 2.6-4.3 4.2l-8.2-2.1a2 2 0 0 0-2.2 1.2l-4 6.9a2 2 0 0 0 1.2 2.8l8.2 2.1c-.1 1.1-.2 2.2-.2 3.4s.1 2.3.2 3.4l-8.2 2.1a2 2 0 0 0-1.2 2.8l4 6.9a2 2 0 0 0 2.2 1.2l8.2-2.1c1.3 1.5 2.7 2.9 4.3 4.2l-4.2 7.3a2 2 0 0 0 .8 2.7l8 4.6a2 2 0 0 0 2.7-.9l4.2-7.3c2 .3 4.1.5 6.3.5s4.3-.2 6.3-.5l4.2 7.3a2 2 0 0 0 2.7.9l8-4.6a2 2 0 0 0 .8-2.7l-4.2-7.3c1.6-1.2 3-2.6 4.3-4.2l8.2 2.1a2 2 0 0 0 2.2-1.2l4-6.9a2 2 0 0 0-1.2-2.8l-8.2-2.1c.1-1.1.2-2.2.2-3.4s-.1-2.3-.2-3.4l8.2-2.1a2 2 0 0 0 1.2-2.8l-4-6.9a2 2 0 0 0-2.2-1.2l-8.2 2.1c-1.3-1.5-2.7-2.9-4.3-4.2l4.2-7.3a2 2 0 0 0-.8-2.7l-8-4.6a2 2 0 0 0-2.7.9l-4.2 7.3c-2-.3-4.1-.5-6.3-.5z"
                    fill="currentColor"
                />
            </motion.svg>
        </div>
    );
}
