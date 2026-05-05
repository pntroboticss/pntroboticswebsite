import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Gallery from "@/lib/models/Gallery";
import School from "@/lib/models/School";
import AboutPhoto from "@/lib/models/AboutPhoto";

export async function GET() {
    try {
        await dbConnect();
        const results: any = {
            gallery: { processed: 0, updated: 0, errors: 0 },
            school: { processed: 0, updated: 0, errors: 0 },
            about: { processed: 0, updated: 0, errors: 0 },
        };

        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "dycht8a6s";
        const uploadPreset = "pnt_academy_unsigned";
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const uploadToCloudinary = async (base64Image: string) => {
            const formData = new FormData();
            formData.append("file", base64Image);
            formData.append("upload_preset", uploadPreset);

            const res = await fetch(cloudinaryUrl, { method: "POST", body: formData });
            if (!res.ok) throw new Error("Cloudinary upload failed");
            const data = await res.json();
            return data.secure_url;
        };

        const processCollection = async (model: any, metricKey: "gallery" | "school" | "about") => {
            const items = await model.find({});
            for (const item of items) {
                results[metricKey].processed++;
                if (item.imageUrl && item.imageUrl.startsWith("data:image")) {
                    try {
                        const newUrl = await uploadToCloudinary(item.imageUrl);
                        item.imageUrl = newUrl;
                        await item.save();
                        results[metricKey].updated++;
                    } catch (error) {
                        results[metricKey].errors++;
                        console.error(`Migration error for ${metricKey} id ${item._id}:`, error);
                    }
                }
            }
        };

        // Run migrations sequentially
        await processCollection(Gallery, "gallery");
        await processCollection(School, "school");
        await processCollection(AboutPhoto, "about");

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
