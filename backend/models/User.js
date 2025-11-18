import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // OTP for verify/reset password
    otp: {
      type: String,
      default: null,
      index: true, // faster queries
    },

    otpExpire: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true } // createdAt, updatedAt automatically
);

export default mongoose.model("User", userSchema);
