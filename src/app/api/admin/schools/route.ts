import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import School from '@/lib/models/School';

export async function GET() {
    try {
        await connectMongo();
        const items = await School.find({}).sort({ createdAt: -1 });
        return NextResponse.json(items, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch school logos' }, { status: 500 });
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

        const newItem = await School.create({ name, imageUrl });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create school logo record' }, { status: 500 });
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
        await School.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete school item' }, { status: 500 });
    }
}
