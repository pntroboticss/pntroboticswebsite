import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Internship from '@/lib/models/Internship';

export async function GET() {
    try {
        await connectMongo();
        const items = await Internship.find({}).sort({ createdAt: -1 });
        return NextResponse.json(items, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch internship logos' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectMongo();
        const data = await req.json();
        const { name, imageUrl } = data;

        if (!name || !imageUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newItem = await Internship.create({ name, imageUrl });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create internship logo' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        await connectMongo();
        await Internship.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete internship logo' }, { status: 500 });
    }
}
