import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        // Since we typically have only 1 row in admin_settings, we update the first one
        // Note: Make sure there's at least one row in the table first!
        const { data: existingSettings } = await supabase.from('admin_settings').select('id').limit(1).maybeSingle();
        const { knowledgeBaseText, knowledgeBaseFileName } = await req.json();
        
        const updateData = { 
            knowledge_base_text: knowledgeBaseText, 
            knowledge_base_file_name: knowledgeBaseFileName || 'document.txt' 
        };
        
        let updated;
        if (existingSettings?.id) {
            const { data, error } = await supabase.from('admin_settings').update(updateData).eq('id', existingSettings.id).select().single();
            if (error) throw error;
            updated = data;
        } else {
            const { data, error } = await supabase.from('admin_settings').insert([{...updateData, name: 'PNT', email: 'contact@pnt.com'}]).select().single();
            if (error) throw error;
            updated = data;
        }

        return NextResponse.json({
            success: true,
            fileName: updated.knowledge_base_file_name,
            textLength: updated.knowledge_base_text?.length || 0,
        }, { status: 200 });
    } catch (error) {
        console.error('Knowledge base upload error:', error);
        return NextResponse.json({ error: 'Failed to save knowledge base' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data: settings } = await supabase.from('admin_settings').select('knowledge_base_text, knowledge_base_file_name').limit(1).maybeSingle();
        return NextResponse.json({
            fileName: settings?.knowledge_base_file_name || '',
            textLength: settings?.knowledge_base_text?.length || 0,
            hasKnowledgeBase: !!(settings?.knowledge_base_text && settings.knowledge_base_text.length > 0),
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch knowledge base info' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const { data: existingSettings } = await supabase.from('admin_settings').select('id').limit(1).maybeSingle();
        if (existingSettings?.id) {
            await supabase.from('admin_settings').update({ knowledge_base_text: '', knowledge_base_file_name: '' }).eq('id', existingSettings.id);
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete knowledge base' }, { status: 500 });
    }
}
