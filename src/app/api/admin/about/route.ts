import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        const { data: items, error } = await supabase.from('about_photos').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        const mappedItems = items.map(item => ({ ...item, _id: item.id, imageUrl: item.image_url }));
        return NextResponse.json(mappedItems, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch about photos' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { caption, imageUrl } = await req.json();
        const { data: item, error } = await supabase.from('about_photos').insert([{ caption, image_url: imageUrl }]).select().single();
        if (error) throw error;
        return NextResponse.json({ ...item, _id: item.id, imageUrl: item.image_url }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
        const { error } = await supabase.from('about_photos').delete().eq('id', id);
        if (error) throw error;
        return NextResponse.json({ message: 'Deleted' }, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
