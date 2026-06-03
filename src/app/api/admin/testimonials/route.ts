import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET testimonials — optionally filter by page (?page=home or ?page=lab)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page');
        let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        if (page) query = query.eq('page', page);
        const { data: testimonials, error } = await query;
        if (error) throw error;
        const mappedTestimonials = testimonials.map(t => ({ ...t, _id: t.id, imageUrl: t.image_url, logoUrl: t.logo_url }));
        return NextResponse.json(mappedTestimonials);
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST a new testimonial
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { data: newTestimonial, error } = await supabase.from('testimonials').insert([{
            name: body.name,
            role: body.role,
            quote: body.quote,
            image_url: body.imageUrl || "",
            logo_url: body.logoUrl || "",
            page: body.page || "employee",
        }]).select().single();
        if (error) throw error;
        
        return NextResponse.json({ success: true, data: { ...newTestimonial, _id: newTestimonial.id, imageUrl: newTestimonial.image_url, logoUrl: newTestimonial.logo_url } }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE a testimonial
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
             return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) throw error;

        return NextResponse.json({ success: true, message: "Testimonial deleted" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
