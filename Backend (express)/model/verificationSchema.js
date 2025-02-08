const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userverificationSchema = new Schema(
  {
    userId: {
      type: String,
    },
    uniquestring: {
      type: String,
      unique: true,
      index: true,
    },
    expireAt: {
      type: String,
    },
  },
  { timestamps: true }
);

const Userverification = mongoose.model("userverification", userverificationSchema);
module.exports = Userverification;
