"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

function NavigationEvents() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Show spinner briefly on navigation
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 500); // Visual flair
        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    if (!loading) return null;
    return <LoadingSpinner />;
}

export default function PageLoader() {
    return (
        <Suspense fallback={null}>
            <NavigationEvents />
        </Suspense>
    );
}
