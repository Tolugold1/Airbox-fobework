const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../utils/constants");

const businessProfileSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      index: true,
      required: true,
    },
    name: {
      type: String,
      unique: true,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    type_of_business: {
      type: String,
      required: false,
    },
    phone_number: {
      type: String,
    },
    location: {
      state: { type: String, required: true },
      city: { type: String, required: true },
      // country: { type: String, required: true },
      zipcode: { type: String, required: true },
    },
    about: {
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

module.exports = EmployerProfile;
