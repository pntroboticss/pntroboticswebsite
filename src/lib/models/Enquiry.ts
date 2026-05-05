import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, default: "" },
        subject: { type: String, default: "General" },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Enquiry =
    mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);

export default Enquiry;
