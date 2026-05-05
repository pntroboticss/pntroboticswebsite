"use client";

import Script from "next/script";

/**
 * GoogleAnalytics — drop this into your root layout.
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX in .env.local / Vercel env vars.
 * The component no-ops in dev or when the env var is absent, so it never breaks local builds.
 */
export default function GoogleAnalytics() {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (!measurementId) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${measurementId}', {
                        page_path: window.location.pathname,
                    });
                `}
            </Script>
        </>
    );
}
