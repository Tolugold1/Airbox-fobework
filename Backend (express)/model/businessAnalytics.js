const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const businessAnalytics = new Schema({
    businessId: {
        type: mongoose.Schema.ObjectId,
        ref: "businessProfile",
        required: true,
        index: true
    },
    revenue: {
        type: Number,
        min: 0,
        default: 0
    },
    TotalCompletedBooking: {
        type: Number,
        min: 0,
        default: 0
    },
    totalScheduledBooking: {
        type: Number,
        min: 0,
        default: 0
    },
    TotalCancelledBooking: {
        type: Number,
        min: 0,
        default: 0
    }
}, { timestamps: true, versionKey: false });

const BusinessAnalytics = mongoose.model("businessAnalytics", businessAnalytics);
