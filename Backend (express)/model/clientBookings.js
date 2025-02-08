const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { BOOKING_STATUS } = require("../utils/constants");

const clientBooking = new Schema({
    clientProfileId: {
        type: mongoose.Schema.ObjectId,
        ref: "clientprofile",
        index: true
    },
    appointmentDate: {
        type: Date,
        default: Date.now
    },
    company_name: {
        type: String
    },
    company_Contact: {
        type: String,
        enum: [ ...Object.values(BOOKING_STATUS)],
        default: "scheduled"
    },
    bookedItemId: {
        type: mongoose.Schema.ObjectId,
        ref: "bookingItem",
        index: true
    },
    status: {
        type: String,

    }
}, { timestamps: true });

const ClientBookings = mongoose.model("clientBooking", clientBooking);

module.exports = ClientBookings;
