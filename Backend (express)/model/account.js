const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { hashSync, compare } = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose");
const { AUTH_TYPE, ACCOUNT_TYPE } = require("../utils/constants");

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    profile_pics: {
      type: Schema.Types.Mixed,
    },
    email: {
      type: String,
      default: "",
    },
    authType: {
      type: String,
      enum: Object.values(AUTH_TYPE),
    },
    username: {
      type: String,
      default: "",
      required: true,
    },
    password: {
      type: String,
    },
    reset_password_token: {
      type: String,
      default: "",
    },
    reset_password_expiresAt: {
      type: String,
      default: "",
    },
    phone_number: { type: String, required: false },
    phone_number_verified: { type: Boolean, default: false },
    lastAccess: {
      type: String,
    },
    AcctType: {
      type: String,
    },
    Confirmed: {
      type: Boolean,
      default: false,
      required: true,
    },
    admin: {
      type: Boolean,
      default: false,
      required: true,
    },
    profile_id: {
      type: String,
      required: false
    },
    signed_in: {
      type: Number,
      default: 0
    },
    profile_status: {
      type: Boolean,
      default: false
    },
    refreshTokens: [String],
  },
  { strict: false, timestamps: true }
);

userSchema.pre("save", function (next) {
  const salt = 10;
  if (this.isModified("password")) {
    this.password = hashSync(this.password, salt);
  }
  
  return next();
});

userSchema.plugin(passportLocalMongoose, {
  resetPasswordTokenExpiresInSeconds: 3600,
});

const User = mongoose.model("user", userSchema);
module.exports = User;
