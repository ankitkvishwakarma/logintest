import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";

import User from "./models/User.js";
import { sendWhatsappMessage } from "./utils/sendWhatsapp.js";
import { sendEmail } from "./utils/sendEmail.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

// DB CONNECT
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));


// ---------------- REGISTER ----------------
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.json({ success: false, msg: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed,
    });

    res.json({ success: true, msg: "Registered successfully", user });
  } catch (e) {
    res.status(500).json({ success: false, msg: "Server Error", error: e });
  }
});


// ---------------- LOGIN ----------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, msg: "Wrong password" });

    await sendWhatsappMessage(`User Logged In: ${email}`);

    res.json({ success: true, msg: "Login Successful", user });
  } catch (e) {
    res.status(500).json({ success: false, msg: "Server Error", error: e });
  }
});


// ---------------- SEND OTP (LOGIN/VERIFY) ----------------
app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, msg: "User not found" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // 🔥 FIXED
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail(email, "Your OTP Code", `Your OTP is: ${otp}`);

    res.json({ success: true, msg: "OTP sent to email" });
  } catch (e) {
    res.status(500).json({ success: false, msg: "OTP error", error: e });
  }
});


// ---------------- VERIFY OTP ----------------
app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otp: String(otp),
      otpExpire: { $gt: new Date() },
    });

    if (!user)
      return res.json({ success: false, msg: "Invalid or expired OTP" });

    user.otp = null;
    user.otpExpire = null;
    await user.save();

    res.json({ success: true, msg: "OTP Verified" });
  } catch (e) {
    res.status(500).json({ success: false, msg: "Verification error", error: e });
  }
});


// ---------------- FORGOT PASSWORD ----------------
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.json({ success: false, msg: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, msg: "User not found" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // 🔥 FIXED
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendEmail(
      email,
      "Reset Password OTP",
      `Your OTP to reset password is: ${otp}`
    );

    res.json({ success: true, msg: "OTP has been sent to your email" });
  } catch (e) {
    res.status(500).json({
      success: false,
      msg: "Server error while sending OTP",
      error: e.message,
    });
  }
});


// ---------------- RESET PASSWORD ----------------
app.post("/reset-password", async (req, res) => {
  console.log("Reset password API HIT");
  try {
    const { email, newPassword } = req.body;

    if (!email) return res.json({ success: false, msg: "Email missing" });

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    // Directly update password (OTP verify already done)
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    await user.save();

    res.json({ success: true, msg: "Password reset successful" });

  } catch (e) {
    res.status(500).json({
      success: false,
      msg: "Reset error",
      error: e.message,
    });
  }
});


app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.listen(process.env.PORT, () =>
  console.log("Server running on port", process.env.PORT)
);
