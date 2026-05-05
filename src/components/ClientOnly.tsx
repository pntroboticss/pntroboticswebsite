"use client";
import { useEffect, useState } from "react";

/**
 * A wrapper to ensure children are only rendered on the client.
 * This prevents hydration mismatches for components that rely on browser-only state 
 * or that shouldn't render at all during SSR (like fixed canvas backgrounds).
 */
export default function ClientOnly({ children }: { children: React.ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) return null;

    return <>{children}</>;
}
