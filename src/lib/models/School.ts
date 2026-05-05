import mongoose, { Schema, Document } from 'mongoose';

export interface ISchool extends Document {
    name: string;
    imageUrl: string;
    createdAt: Date;
}

const SchoolSchema: Schema = new Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.School || mongoose.model<ISchool>('School', SchoolSchema);
