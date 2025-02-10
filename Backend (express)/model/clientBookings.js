const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { BOOKING_STATUS } = require("../utils/constants");

const clientBooking = new Schema({
    clientProfileId: {
        type: mongoose.Types.ObjectId,
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
    },
    bookedItemId: {
        type: mongoose.Types.ObjectId,
        ref: "bookingItem",
        index: true
    },
    status: {
        type: String,
        enum: [ ...Object.values(BOOKING_STATUS)],
        default: "scheduled"
    }
}, { timestamps: true });

const ClientBookings = mongoose.model("clientBooking", clientBooking);

module.exports = ClientBookings;
