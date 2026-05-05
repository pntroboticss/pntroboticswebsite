import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import AboutPhoto from '@/lib/models/AboutPhoto';

export async function GET() {
    try {
        await connectMongo();
        const items = await AboutPhoto.find({}).sort({ createdAt: -1 });
        return NextResponse.json(items, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch about photos' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectMongo();
        const { caption, imageUrl } = await req.json();
        if (!imageUrl) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }
        const item = await AboutPhoto.create({ caption, imageUrl });
        return NextResponse.json(item, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        await connectMongo();
        await AboutPhoto.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Deleted' }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
