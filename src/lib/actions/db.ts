"use server";
import connectMongo from "@/lib/mongodb";
import Gallery from "@/lib/models/Gallery";
import School from "@/lib/models/School";
import Internship from "@/lib/models/Internship";
import AboutPhoto from "@/lib/models/AboutPhoto";
import Faq from "@/lib/models/Faq";
import Testimonial from "@/lib/models/Testimonial";

export async function getLiveTestimonials() {
    try {
        await connectMongo();
        const items = await Testimonial.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(items));
    } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        return [];
    }
}

// Using Lean() for plain JSON objects to pass safely to Client Components
import SiteMetric from "@/lib/models/SiteMetric";

export async function incrementLiveVisits() {
    try {
        await connectMongo();
        // Increment the total_visits counter by 1, or create it if it doesn't exist
        const metric = await SiteMetric.findOneAndUpdate(
            { key: "total_visits" },
            { $inc: { value: 1 } },
            { returnDocument: "after", upsert: true }
        ).lean();
        return metric?.value || 0;
    } catch (error) {
        console.error("Failed to increment visits:", error);
        return 0;
    }
}

export async function getLiveFaqs() {
    try {
        await connectMongo();
        const items = await Faq.find({}).sort({ order: 1, createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(items));
    } catch (error) {
        console.error("Failed to fetch FAQs:", error);
        return [];
    }
}
export async function getLiveGallery() {
    try {
        await connectMongo();
        const items = await Gallery.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(items));
    } catch (error) {
        console.error("Failed to fetch gallery:", error);
        return [];
    }
}

export async function getLiveSchools() {
    try {
        await connectMongo();
        const items = await School.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(items));
    } catch (error) {
        console.error("Failed to fetch schools:", error);
        return [];
    }
}

export async function getLiveInternships() {
    try {
        await connectMongo();
        const items = await Internship.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(items));
    } catch (error) {
        console.error("Failed to fetch internships:", error);
        return [];
    }
}

export async function getLiveAboutPhotos() {
    try {
        await connectMongo();
        const items = await AboutPhoto.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(items));
    } catch (error) {
        console.error("Failed to fetch about photos:", error);
        return [];
    }
}

import AdminSettings from "@/lib/models/AdminSettings";

export async function getAdminSettings() {
    try {
        await connectMongo();
        const settings = await AdminSettings.findOne({}).lean();
        return JSON.parse(JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to fetch admin settings:", error);
        return null;
    }
}
