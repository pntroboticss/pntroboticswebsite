import mongoose from "mongoose";

const AboutPhotoSchema = new mongoose.Schema(
    {
        caption: { type: String, default: "" },
        imageUrl: { type: String, required: true },
    },
    { timestamps: true }
);

const AboutPhoto =
    mongoose.models.AboutPhoto ||
    mongoose.model("AboutPhoto", AboutPhotoSchema);

export default AboutPhoto;
