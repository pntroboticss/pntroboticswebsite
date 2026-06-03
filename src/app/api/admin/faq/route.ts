import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('faqs')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { question, answer, order } = await req.json();

        if (!question || !answer) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data: newFaq, error } = await supabase
            .from('faqs')
            .insert([{ question, answer, display_order: order || 0 }])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ success: true, faq: newFaq }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        const { error } = await supabase
            .from('faqs')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
    }
}
