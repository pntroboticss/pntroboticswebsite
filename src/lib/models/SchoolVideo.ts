import mongoose from "mongoose";

const SchoolVideoSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    startTime: {
        type: Number,
        default: 0,
    },
    endTime: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const SchoolVideo = mongoose.models.SchoolVideo || mongoose.model("SchoolVideo", SchoolVideoSchema);
