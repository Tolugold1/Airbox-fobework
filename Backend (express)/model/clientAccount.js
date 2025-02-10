const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../utils/constants");

const clientProfileSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    index: true,
  },
  Fullname: {
    type: String,
    required: true,
    unique: false
  },
  Address: {
    type: String,
  },
  Email: {
    type: String,
  },
  Phone_number: {
    type: String
  },
  About: {
    type: String
  },
},  { timestamps: true })


const ClientProfiles = mongoose.model("clientprofile", clientProfileSchema);

module.exports = ClientProfiles;
