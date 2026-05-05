import mongoose from "mongoose";

const PaymentTicketSchema = new mongoose.Schema(
    {
        ticketId: { type: String, required: true, unique: true, index: true },
        clientName: { type: String, default: "Not provided" },
        courseName: { type: String, default: "Not specified" },
        amount: { type: String, default: "Not specified" },
        queryMessage: { type: String, required: true },
        status: {
            type: String,
            enum: ["open", "resolved", "closed"],
            default: "open",
        },
    },
    { timestamps: true }
);

const PaymentTicket =
    mongoose.models.PaymentTicket || mongoose.model("PaymentTicket", PaymentTicketSchema);

export default PaymentTicket;
