import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        
        const name = formData.get("name") as string;
        const college = formData.get("college") as string;
        const quote = formData.get("quote") as string;
        const imageFile = formData.get("image") as File;

        if (!name || !college || !quote || !imageFile) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        /* 
         * TODO: STORAGE PROVIDER INTEGRATION
         * The user needs to confirm which provider they want (Cloudinary, Vercel Blob, Firebase).
         * 
         * Example workflow for Vercel Blob:
         * const blob = await put(imageFile.name, imageFile, { access: 'public' });
         * const imageUrl = blob.url;
         * 
         * Example workflow for Cloudinary:
         * const arrayBuffer = await imageFile.arrayBuffer();
         * const buffer = Buffer.from(arrayBuffer);
         * // Upload buffer to Cloudinary using v2.uploader.upload_stream
         * 
         */

        // Placeholder image URL until provider is confirmed
        const imageUrl = `https://placeholder-storage.com/${imageFile.name}`;

        // TODO: Database/Sheet saving logic here
        // e.g., await db.insert({ name, college, quote, imageUrl })

        return NextResponse.json({ 
            success: true, 
            message: "Testimonial draft received.", 
            data: { name, college, quote, imageUrl } 
        });

    } catch (error) {
        console.error("Testimonial upload error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
