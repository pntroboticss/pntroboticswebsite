import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        const { data: items, error } = await supabase.from('internships').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        const mappedItems = items.map(item => ({ ...item, _id: item.id, imageUrl: item.image_url }));
        return NextResponse.json(mappedItems, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch internship logos' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();
        const { data: newItem, error } = await supabase.from('internships').insert([{ name, image_url: imageUrl }]).select().single();
        if (error) throw error;
        return NextResponse.json({ ...newItem, _id: newItem.id, imageUrl: newItem.image_url }, { status: 201 });
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

        const { error } = await supabase.from('internships').delete().eq('id', id);
        if (error) throw error;

        return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete internship logo' }, { status: 500 });
    }
}
