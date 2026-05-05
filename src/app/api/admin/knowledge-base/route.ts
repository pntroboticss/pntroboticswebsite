import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import AdminSettings from '@/lib/models/AdminSettings';

export async function POST(req: Request) {
    try {
        await connectMongo();
        const data = await req.json();
        const { knowledgeBaseText, knowledgeBaseFileName } = data;

        if (!knowledgeBaseText || typeof knowledgeBaseText !== 'string') {
            return NextResponse.json({ error: 'No text content provided' }, { status: 400 });
        }

        // Limit to ~500KB of text (safety guard for MongoDB doc size)
        if (knowledgeBaseText.length > 500000) {
            return NextResponse.json({ error: 'Document too large. Max ~500KB of text.' }, { status: 413 });
        }

        const updated = await AdminSettings.findOneAndUpdate(
            {},
            { knowledgeBaseText, knowledgeBaseFileName: knowledgeBaseFileName || 'document.txt' },
            { upsert: true, returnDocument: "after", new: true }
        );

        return NextResponse.json({
            success: true,
            fileName: updated.knowledgeBaseFileName,
            textLength: updated.knowledgeBaseText?.length || 0,
        }, { status: 200 });
    } catch (error) {
        console.error('Knowledge base upload error:', error);
        return NextResponse.json({ error: 'Failed to save knowledge base' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectMongo();
        const settings = await AdminSettings.findOne({}).select('knowledgeBaseText knowledgeBaseFileName').lean();
        return NextResponse.json({
            fileName: settings?.knowledgeBaseFileName || '',
            textLength: settings?.knowledgeBaseText?.length || 0,
            hasKnowledgeBase: !!(settings?.knowledgeBaseText && settings.knowledgeBaseText.length > 0),
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch knowledge base info' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await connectMongo();
        await AdminSettings.findOneAndUpdate(
            {},
            { knowledgeBaseText: '', knowledgeBaseFileName: '' },
            { returnDocument: "after" }
        );
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete knowledge base' }, { status: 500 });
    }
}
