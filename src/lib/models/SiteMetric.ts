import mongoose from "mongoose";

const SiteMetricSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },
        value: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const SiteMetric = mongoose.models.SiteMetric || mongoose.model("SiteMetric", SiteMetricSchema);

export default SiteMetric;
