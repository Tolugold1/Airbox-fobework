const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../utils/constants");

const businessProfileSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      index: true,
      required: true,
    },
    name: {
      type: String,
      unique: true,
      required: true,
    },
    Email: { type: String, required: true, unique: true },
    type_of_business: {
      type: String,
      required: false,
    },
    phone_number: {
      type: String,
    },
    location: {
      type: String
    },
    About: {
      type: String,
      required: true,
    },
    hours: {
      opening: { type: String, required: true },
      closing: { type: String, required: true },
    },
    open_days: [String],
    website: {
      type: String,
    }
  },
  { timestamps: true, versionKey: false }
);

const BusinessProfile = mongoose.model("businessProfile", businessProfileSchema);

module.exports = BusinessProfile;
