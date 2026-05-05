import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const directoryPath = path.join(process.cwd(), 'public', 'internships');
    let logos: string[] = [];

    try {
        if (fs.existsSync(directoryPath)) {
            const files = fs.readdirSync(directoryPath);
            // Filter out non-image files if necessary
            logos = files.filter(file => /\.(png|jpe?g|svg|webp|gif)$/i.test(file));
        }
    } catch (err) {
        console.error("Error reading internships directory:", err);
    }

    return NextResponse.json({ logos });
}
