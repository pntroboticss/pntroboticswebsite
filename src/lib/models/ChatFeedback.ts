import mongoose from "mongoose";

const ChatFeedbackSchema = new mongoose.Schema(
    {
        userMessage: {
            type: String,
            required: true,
        },
        aiResponse: {
            type: String,
            required: true,
        },
        isThumbsUp: {
            type: Boolean,
            required: true,
        },
        read: {
            type: Boolean,
            default: false, // For admin to mark as read/reviewed
        },
    },
    { timestamps: true }
);

export default mongoose.models.ChatFeedback || mongoose.model("ChatFeedback", ChatFeedbackSchema);
