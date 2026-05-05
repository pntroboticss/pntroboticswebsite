import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminSettings extends Document {
    name: string;
    email: string;
    profileImage?: string; // Base64 data URL
    socialLinks: {
        instagram?: string;
        linkedin?: string;
        twitter?: string;
        youtube?: string;
    };
    careersLink?: string;
    bootcampLink?: string; // For the Free AI & Robotics Bootcamp ribbon
    roboticsChampionshipLink?: string; // Link for the Robotics Championship ribbon (Schools)
    individualChampionshipLink?: string; // Link for the Individual Student Championship Registration
    sheetsWebhookUrl?: string; // For auto-syncing enquiries to Google Sheets
    paymentDetails?: {
        upiId?: string;
        upiQrCodeBase64?: string;
        accountName?: string;
        accountNumber?: string;
        ifscCode?: string;
        bankName?: string;
    };
    knowledgeBaseText?: string; // Extracted text from uploaded company docs
    knowledgeBaseFileName?: string; // Name of the uploaded file
}

const AdminSettingsSchema = new Schema<IAdminSettings>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    profileImage: { type: String },
    socialLinks: {
        instagram: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        twitter: { type: String, default: "" },
        youtube: { type: String, default: "" },
    },
    careersLink: { type: String, default: "" },
    bootcampLink: { type: String, default: "" },
    roboticsChampionshipLink: { type: String, default: "" },
    individualChampionshipLink: { type: String, default: "" },
    sheetsWebhookUrl: { type: String, default: "" },
    paymentDetails: {
        upiId: { type: String, default: "" },
        upiQrCodeBase64: { type: String, default: "" },
        accountName: { type: String, default: "" },
        accountNumber: { type: String, default: "" },
        ifscCode: { type: String, default: "" },
        bankName: { type: String, default: "" },
    },
    knowledgeBaseText: { type: String, default: "" },
    knowledgeBaseFileName: { type: String, default: "" },
});

export default mongoose.models.AdminSettings || mongoose.model<IAdminSettings>('AdminSettings', AdminSettingsSchema);
