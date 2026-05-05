import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Enquiry from '@/lib/models/Enquiry';

export async function GET() {
    try {
        await connectMongo();
        const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).lean();

        // Convert to CSV
        const headers = ['Date', 'Name', 'Email', 'Phone', 'Subject', 'Message'];
        const rows = enquiries.map((e: any) => {
            const date = new Date(e.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
            return [
                `"${date}"`,
                `"${e.name?.replace(/"/g, '""') || ''}"`,
                `"${e.email?.replace(/"/g, '""') || ''}"`,
                `"${e.phone?.replace(/"/g, '""') || ''}"`,
                `"${e.subject?.replace(/"/g, '""') || ''}"`,
                `"${e.message?.replace(/"/g, '""') || ''}"`
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="pnt_enquiries_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error('Failed to export CSV:', error);
        return NextResponse.json({ error: 'Failed to export to CSV' }, { status: 500 });
    }
}
