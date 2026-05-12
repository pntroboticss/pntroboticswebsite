import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryItem extends Document {
    title: string;
    category: string;
    pageLocation?: string;
    imageUrl: string;
    createdAt: Date;
}

const GallerySchema: Schema = new Schema({
    title: { type: String, required: true },
    category: {
        type: String,
        required: true,
        // Using a flexible string instead of strict enum to allow for more granular sections like 'Hero', 'Testimonials', etc.
    },
    pageLocation: {
        type: String,
        default: "Gallery",
    },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Gallery || mongoose.model<IGalleryItem>('Gallery', GallerySchema);
