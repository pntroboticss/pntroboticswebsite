import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Testimonial from "@/lib/models/Testimonial";

// GET testimonials — optionally filter by page (?page=home or ?page=lab)
export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const page = searchParams.get("page");
        const query = page ? { page } : {};
        const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
        return NextResponse.json(testimonials);
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST a new testimonial
export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        
        if (!body.name || !body.role || !body.quote) {
            return NextResponse.json({ success: false, message: "Name, role, and quote are required" }, { status: 400 });
        }

        const newTestimonial = await Testimonial.create({
            name: body.name,
            role: body.role,
            quote: body.quote,
            imageUrl: body.imageUrl || "",
            logoUrl: body.logoUrl || "",
            page: body.page || "employee",
        });
        return NextResponse.json({ success: true, data: newTestimonial }, { status: 201 });
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

        await dbConnect();
        const deletedTestimonial = await Testimonial.findByIdAndDelete(id);
        
        if (!deletedTestimonial) {
            return NextResponse.json({ success: false, message: "Testimonial not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Testimonial deleted" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
