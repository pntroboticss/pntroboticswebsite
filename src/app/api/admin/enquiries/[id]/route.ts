import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        
        const { error } = await supabase
            .from('enquiries')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Failed to delete enquiry:', error);
            return NextResponse.json({ error: 'Enquiry not found or could not be deleted' }, { status: 404 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Failed to delete enquiry:', error);
        return NextResponse.json({ error: 'Failed to delete enquiry' }, { status: 500 });
    }
}
