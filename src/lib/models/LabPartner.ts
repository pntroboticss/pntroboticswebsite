import mongoose, { Schema, Document } from 'mongoose';

export interface ILabPartner extends Document {
    name: string;
    imageUrl: string;
    category: 'client' | 'industry' | 'hiring';
    createdAt: Date;
}

const LabPartnerSchema: Schema = new Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true, enum: ['client', 'industry', 'hiring'] },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.LabPartner || mongoose.model<ILabPartner>('LabPartner', LabPartnerSchema);
