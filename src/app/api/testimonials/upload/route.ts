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
         * The user needs to confirm which provider they want (Supabase).
         * 
         * Example workflow for Supabase:
         * const { data, error } = await supabase.storage.from('website_assets').upload(imageFile.name, imageFile);
         * const { data: publicUrl } = supabase.storage.from('website_assets').getPublicUrl(imageFile.name);
         * const imageUrl = publicUrl.publicUrl;
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
