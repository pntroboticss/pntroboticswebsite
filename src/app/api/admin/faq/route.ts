import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Faq from "@/lib/models/Faq";

export async function GET() {
    try {
        await connectMongo();
        const faqs = await Faq.find({}).sort({ order: 1, createdAt: -1 });
        return NextResponse.json(faqs);
    } catch {
        return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { question, answer, order } = await req.json();
        await connectMongo();

        if (!question || !answer) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newFaq = await Faq.create({ question, answer, order: order || 0 });
        return NextResponse.json({ success: true, faq: newFaq }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        await connectMongo();

        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        await Faq.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
    }
}
