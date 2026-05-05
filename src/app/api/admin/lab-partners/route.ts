import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import LabPartner from '@/lib/models/LabPartner';

export async function GET(req: Request) {
    try {
        await connectMongo();
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        const filter = category ? { category } : {};
        const items = await LabPartner.find(filter).sort({ createdAt: -1 });
        return NextResponse.json(items, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch lab partners' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectMongo();
        const data = await req.json();
        const { name, imageUrl, category } = data;

        if (!name || !imageUrl || !category) {
            return NextResponse.json({ error: 'Missing required fields (name, imageUrl, category)' }, { status: 400 });
        }

        const newItem = await LabPartner.create({ name, imageUrl, category });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create lab partner' }, { status: 500 });
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
        await LabPartner.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Lab partner deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete lab partner' }, { status: 500 });
    }
}
