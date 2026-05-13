import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use server-side Supabase client with anon key
// Supabase SDK uses parameterized queries internally — immune to SQL injection
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Strict UUID v4 regex — rejects any non-UUID input including SQL injection attempts
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Short-code: first 8 hex chars (no dashes). We also accept this.
const SHORT_CODE_REGEX = /^[0-9a-f]{8}$/i;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const raw: string = (body?.applicationId ?? "").trim();

    // --- Input validation ---
    if (!raw || raw.length > 36) {
      return NextResponse.json(
        { error: "Invalid Application ID format." },
        { status: 400 }
      );
    }

    // Block anything that looks suspicious (contains SQL keywords / special chars)
    const FORBIDDEN = /['";\-\-\/\*\\<>{}()|&]/;
    if (FORBIDDEN.test(raw.replace(/-/g, ""))) {
      return NextResponse.json(
        { error: "Invalid characters in Application ID." },
        { status: 400 }
      );
    }

    let query;

    if (UUID_REGEX.test(raw)) {
      // Full UUID — query by exact id
      query = supabase
        .from("job_applications")
        .select("id, name, status, created_at, answers")
        .eq("id", raw) // parameterized — safe
        .single();
    } else if (SHORT_CODE_REGEX.test(raw)) {
      // Short 8-char prefix — use ilike with escaped value (no special chars confirmed above)
      query = supabase
        .from("job_applications")
        .select("id, name, status, created_at, answers")
        .ilike("id", `${raw}%`) // safe: no special regex chars can pass the regex check above
        .limit(1)
        .single();
    } else {
      return NextResponse.json(
        { error: "Application ID must be the 8-character code or full UUID from your confirmation." },
        { status: 400 }
      );
    }

    const { data, error } = await query;

    if (error || !data) {
      return NextResponse.json(
        { error: "No application found with this ID. Please check and try again." },
        { status: 404 }
      );
    }

    // Return ONLY minimal, non-sensitive information
    return NextResponse.json(
      {
        applicantName: data.name,
        status: data.status,
        applicationType: data.answers?.application_type === "internship" ? "Internship" : "Job Application",
        appliedOn: new Date(data.created_at).toLocaleDateString("en-IN", {
          year: "numeric", month: "long", day: "numeric",
        }),
        shortId: data.id.slice(0, 8).toUpperCase(),
      },
      {
        status: 200,
        headers: {
          // Basic rate limiting hint for reverse proxies/Vercel
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
