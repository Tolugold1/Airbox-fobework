const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../utils/constants");

const bookingItems = new Schema(
  {
    businessId: {
      type: mongoose.Types.ObjectId,
      ref: "businessProfile",
      index: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: { 
        type: String,
        required: true
    },
    type: {
      type: String, // tables, equipment, room, restaurant, etc
      required: false,
    },
    slots: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    availableSlots: {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    },
    open_days: [String],
    pricing: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
      type: String
    }
  },
  { timestamps: true, versionKey: false }
);

const BookingItems = mongoose.model("bookingItem", bookingItems);

module.exports = BookingItems;
