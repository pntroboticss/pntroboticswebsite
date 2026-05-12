import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplicationForm from "./ApplicationForm";
import Link from "next/link";

export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params object (Required in Next.js 15+)
  const resolvedParams = await params;
  
  // Fetch the job securely on the server
  const { data: job } = await supabase
    .from("job_postings")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-500">
        <p className="font-bold text-xl mb-4 text-slate-900 dark:text-white">Job not found.</p>
        <Link href="/careers" className="text-blue-500 hover:underline">Back to Careers</Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <ApplicationForm job={job} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
