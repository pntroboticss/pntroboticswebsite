import mongoose, { Schema, Document } from 'mongoose';

export interface IInternship extends Document {
    name: string;
    imageUrl: string;
    createdAt: Date;
}

const InternshipSchema: Schema = new Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Internship || mongoose.model<IInternship>('Internship', InternshipSchema);
