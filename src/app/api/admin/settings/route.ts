import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import AdminSettings from '@/lib/models/AdminSettings';

export async function GET() {
    try {
        await connectMongo();
        const settings = await AdminSettings.findOne({});
        return NextResponse.json(settings || {}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectMongo();
        const data = await req.json();
        const { name, email, profileImage, socialLinks, careersLink, sheetsWebhookUrl, paymentDetails, bootcampLink, roboticsChampionshipLink, individualChampionshipLink } = data;
        if (!name || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        // Upsert single settings document
        const updated = await AdminSettings.findOneAndUpdate(
            {},
            { name, email, profileImage, socialLinks, careersLink, sheetsWebhookUrl, paymentDetails, bootcampLink, roboticsChampionshipLink, individualChampionshipLink },
            { upsert: true, returnDocument: "after", new: true }
        );
        return NextResponse.json(updated, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
