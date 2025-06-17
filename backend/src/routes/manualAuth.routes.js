// backend/routes/manualAuth.routes.js

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { sendEmail } from "../lib/email.js";
import { generateToken } from "../lib/token.js";

const router = express.Router();
const otpStore = new Map();
// Signup request from user(manually)
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing && !existing.isVerified) {
            await User.deleteOne({ email });
        } 
        else if (existing && existing.isVerified) {
            return res.status(400).json({ 
                message: "Email already in use" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            provider: "manual",
            isVerified: false,
        });

        await user.save();

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
        otpStore.set(email, { otp, expiry });

        await sendEmail(
             email,
             "OTP Verification for CFTracker", 
             `Your OTP is: ${otp}`
            );

        res.status(201).json({ 
            message: "OTP sent to email"
         });
    } 
    catch (err) {
        res.status(500).json({ 
            message: "Signup failed", 
            error: err.message 
        });
    }
});
//  Verify OTP
router.post("/verify", async (req, res) => {
    const { email, otp } = req.body;

    const stored = otpStore.get(email);
    if (!stored) {
        return res.status(400).json({ 
            message: "No OTP found. Please sign up again."
         });
    }

    // Check expiry
    if (Date.now() > stored.expiry) {
        otpStore.delete(email);
        return res.status(400).json({ 
            message: "OTP expired. Please sign up again."
         });
    }

    // Check match
    if (stored.otp !== otp) {
        return res.status(400).json({ 
            message: "Invalid OTP" 
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isVerified = true;
        await user.save();

        otpStore.delete(email); // Clean up after successful verification

        res.status(200).json({ 
            message: "Email verified. You can now login."
         });
    } catch (err) {
        res.status(500).json({ 
            message: "Verification failed", 
            error: err.message 
        });
    }
});
//  Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});

        if (!user || !user.isVerified)
            return res.status(400).json({
             message: "Invalid credentials or unverified account" 
        });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({
             message: "Incorrect password" 
            });

        generateToken(user._id, res);

        res.status(200).json({
             message: "Login successful",
             user 
            });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
});

export default router;
