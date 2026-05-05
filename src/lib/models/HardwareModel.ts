import mongoose, { Schema, Document } from "mongoose";

export interface IHardwareModel extends Document {
    name: string;
    description: string;
    modelPath: string; // path inside /public e.g. "/model.glb" or "/models/arm.glb"
    active: boolean;
    sortOrder: number;
    createdAt: Date;
}

const HardwareModelSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    modelPath: { type: String, required: true },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.HardwareModel ||
    mongoose.model<IHardwareModel>("HardwareModel", HardwareModelSchema);
