import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryItem extends Document {
    title: string;
    category: string;
    imageUrl: string;
    createdAt: Date;
}

const GallerySchema: Schema = new Schema({
    title: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ["All", "Projects", "Workshop", "Industrial Visit", "Schools", "Lab Setup", "Robotics Lab"]
    },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Gallery || mongoose.model<IGalleryItem>('Gallery', GallerySchema);
