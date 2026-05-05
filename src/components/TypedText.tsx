"use client";
import { useState, useEffect } from "react";

const WORDS = ["Innovators.", "Problem Solvers.", "Future Engineers.", "Leaders."];

export default function TypedText() {
    const [wordIndex, setWordIndex] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const current = WORDS[wordIndex];
        let timeout: ReturnType<typeof setTimeout>;

        if (!isDeleting && displayed === current) {
            // Pause before deleting
            timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayed === "") {
            // Move to next word
            setIsDeleting(false);
            setWordIndex((i) => (i + 1) % WORDS.length);
        } else {
            const speed = isDeleting ? 60 : 100;
            timeout = setTimeout(() => {
                setDisplayed(
                    isDeleting
                        ? current.slice(0, displayed.length - 1)
                        : current.slice(0, displayed.length + 1)
                );
            }, speed);
        }

        return () => clearTimeout(timeout);
    }, [displayed, isDeleting, wordIndex]);

    return (
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            {displayed}
            <span className="animate-pulse text-blue-500">|</span>
        </span>
    );
}
