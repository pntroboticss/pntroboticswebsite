import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        const { data: enquiries, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        // Convert to CSV
        const headers = ['Date', 'Name', 'Email', 'Phone', 'Subject', 'Message'];
        const rows = (enquiries || []).map((e: any) => {
            const date = new Date(e.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
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
