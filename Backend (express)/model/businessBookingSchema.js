const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { BOOKING_STATUS } = require("../utils/constants");

const bookingSchema = new Schema({
    businessId: {
        type: mongoose.Types.ObjectId,
        ref: "businessProfile",
        index: true
    },
    clientProfileId: {
        type: mongoose.Types.ObjectId, // clientProfileId
        ref: "clientprofile",
        required: true
    },
    appointmentDate: { 
        type: Date, 
        required: true 
    },
    status: {
        type: String,
        enum: [ ...Object.values(BOOKING_STATUS)],
        default: 'scheduled'
    },
    bookedItemId: {
        type: mongoose.Types.ObjectId,
        ref: "bookingItem",
        index: true
    }
}, { timestamps: true });

const Bookings = mongoose.model("bookings", bookingSchema);

module.exports = Bookings;
