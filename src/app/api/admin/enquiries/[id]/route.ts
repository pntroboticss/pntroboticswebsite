import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Enquiry from '@/lib/models/Enquiry';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectMongo();

        const deleted = await Enquiry.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Failed to delete enquiry:', error);
        return NextResponse.json({ error: 'Failed to delete enquiry' }, { status: 500 });
    }
}
