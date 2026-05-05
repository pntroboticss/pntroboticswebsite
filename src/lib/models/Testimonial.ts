import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
    name: string;
    role: string;
    quote: string;
    imageUrl: string;
    logoUrl?: string; // Optional field for school/company logo
    page: "employee" | "lab" | "college" | "kids" | "schools"; // which page this testimonial appears on
    createdAt: Date;
}

const TestimonialSchema: Schema = new Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    quote: { type: String, required: true },
    imageUrl: { type: String }, // Made optional so kids don't require faces
    logoUrl: { type: String },
    page: { type: String, enum: ["employee", "lab", "college", "kids", "schools"], default: "employee" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
