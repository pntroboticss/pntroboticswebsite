import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageLoader from "@/components/PageLoader";
import "./globals.css";

import ClientIntroWrapper from "@/components/ClientIntroWrapper";

import ClientOnly from "@/components/ClientOnly";
import NetworkBackground from "@/components/NetworkBackground";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MobileBottomNav from "@/components/MobileBottomNav";
import { CookieBanner } from "@/components/CookieBanner";
import MaintenanceOverlay from "@/components/MaintenanceOverlay";
import ScrollProgress from "@/components/ScrollProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "PNT Robotics",
  title: {
    default: "PNT Robotics | Innovative Robotics Solutions",
    template: "%s | PNT Robotics"
  },
  description: "PNT Robotics is a premier manufacturing and R&D company specializing in innovative robotics, automation, and IoT solutions.",
  keywords: ["Robotics Manufacturing", "R&D", "Industrial Automation", "IoT Solutions", "PNT Robotics", "Custom Robotics", "Defense Robotics"],
  authors: [{ name: "PNT Robotics" }],
  creator: "PNT Robotics",
  publisher: "PNT Robotics",
  metadataBase: new URL("https://pntrobotics.vercel.app"),
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PNT Robotics",
  },
  openGraph: {
    title: "PNT Robotics | Premier Manufacturing & R&D Hub",
    description: "PNT Robotics is a premier manufacturing and R&D company specializing in innovative robotics, automation, and IoT solutions.",
    url: "https://pntrobotics.com",
    siteName: "PNT Robotics",
    locale: "en_IN",
    type: "website",
    images: [{ url: "https://pntrobotics.com/opengraph-image", width: 1200, height: 630, alt: "PNT Robotics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PNT Robotics | Premier Manufacturing & R&D Hub",
    description: "PNT Robotics is a premier manufacturing and R&D company specializing in innovative robotics, automation, and IoT solutions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PNT Robotics",
  "url": "https://pntrobotics.com",
  "logo": "https://pntrobotics.vercel.app/PNT%20Robo%20logo.png",
  "description": "Innovative robotics, automation, and IoT solutions.",
  "sameAs": [
    "https://instagram.com/pntrobotics",
    "https://linkedin.com/company/pntrobotics",
    "https://youtube.com/@pntrobotics"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Plot no. A115, Infinity Business Park, MIDC",
    "addressLocality": "Dombivli East",
    "addressRegion": "Maharashtra",
    "postalCode": "421203",
    "addressCountry": "IN"
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to CDNs used on every page — browser opens TCP+TLS handshake early */}
        <link rel="preconnect" href="https://ajax.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 min-h-screen selection:bg-blue-600 selection:text-white transition-colors duration-500`}
      >
        {/* Google Analytics — loaded after page is interactive, zero render-blocking */}
        <GoogleAnalytics />

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* Global animated background */}
          <ClientOnly>
            <div className="fixed inset-0 z-0 pointer-events-none">
              <NetworkBackground />
            </div>
          </ClientOnly>


          <ClientIntroWrapper />
          <PageLoader />
          <MaintenanceOverlay />
          <ScrollProgress />

          <div className="relative z-10 pb-32 md:pb-0">
            {children}
          </div>

          {/* Mobile Tab Bar */}
          <MobileBottomNav />
          
          {/* Global Cookie Banner */}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
