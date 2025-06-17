// backend/routes/manualAuth.routes.js

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { sendEmail } from "../lib/email.js";
import { generateToken } from "../lib/token.js";

const router = express.Router();

// Signup request from user(manually)
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing && !existing.isVerified) {
            await User.deleteOne({ email }); // clear previous unverified email
        } 
        else if (existing && existing.isVerified) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            username,
            email,
            password: hashedPassword,
            provider: "manual",
            otp,
            isVerified: false,
        });

        await user.save();

        await sendEmail(email, " OTP Verification for CFTracker", `Your OTP is: ${otp}`);

        res.status(201).json({ message: "OTP sent to email" });
    } 
    catch (err) {
        res.status(500).json({ message: "Signup failed", error: err.message });
    }
});

//  Verify OTP
router.post("/verify", async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

        user.isVerified = true;
        user.otp = null;
        await user.save();

        res.status(200).json({ message: "Email verified. You can now login." });
    } 
    catch (err) {
        res.status(500).json({ message: "Verification failed", error: err.message });
    }
});

//  Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});

        if (!user || !user.isVerified)
            return res.status(400).json({ message: "Invalid credentials or unverified account" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        generateToken(user._id, res);

        res.status(200).json({ message: "Login successful", user });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
});

export default router;
