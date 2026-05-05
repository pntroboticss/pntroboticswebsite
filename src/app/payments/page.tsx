import { getAdminSettings } from "@/lib/actions/db";
import PaymentDetailsClient from "@/app/payments/PaymentDetailsClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Secure Payments | PNT Academy",
    description: "Make secure, zero-commission payments directly to PNT Academy via UPI or Bank Transfer. Supports GPay, PhonePe, Paytm, and all UPI apps.",
    alternates: { canonical: "/payments" },
};

export const revalidate = 60;

interface PaymentsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PaymentsPage({ searchParams }: PaymentsPageProps) {
    const [settings, params] = await Promise.all([
        getAdminSettings(),
        searchParams,
    ]);

    const paymentDetails = settings?.paymentDetails || null;

    // Read URL query params for personalized payment links
    const amount = typeof params.amount === "string" ? params.amount : undefined;
    const course = typeof params.course === "string" ? params.course : undefined;
    const name = typeof params.name === "string" ? params.name : undefined;

    return (
        <>
            <Navbar />
            <PaymentDetailsClient
                details={paymentDetails}
                amount={amount}
                course={course}
                clientName={name}
                whatsappNumber={settings?.socialLinks?.whatsapp || "919326014648"}
            />
            <Footer />
        </>
    );
}
