import User from "../models/user.model.js";
import { generateToken } from "../lib/token.js";
import { sendEmail } from "../lib/email.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const otpStore = {};

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({
                message: "Email already in use"
            });
        }
        // generate the random OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const timeoutId = setTimeout(()=>{
            delete otpStore[email];
        }, 5 * 60 * 1000);
        console.log(otp);
        otpStore[email] = {otp, timeoutId};

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
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user || !user.isVerified)
            return res.status(400).json({ message: "Invalid credentials or unverified account" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        generateToken(user._id, res);

        res.status(200).json({ message: "Login successful", user });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
}

export const verify = async (req, res) =>{
    const {username, email, password, otp } = req.body;
    const stored = otpStore[email];
    if (!stored) {
        return res.status(400).json({
            message: "No OTP found. Please sign up again."
        });
    }
    // Check match
    if (stored.otp !== otp) {
        return res.status(400).json({
            message: "Invalid OTP"
        });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            provider: "manual",
        });

        await user.save(); 
        clearTimeout(stored.timeoutId)
        delete otpStore[email]; // Clean up after successful verification
        generateToken(user._id, res);
        res.status(200).json({
            username: user.username,
            email: user.email
        });
    } catch (err) {
        res.status(500).json({
            message: "Verification failed",
            error: err.message
        });
    }
}

export const getInfo = async (req, res) => {
    console.log(req.user);
    try{
        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log(req.user);
        return res.status(200).json({
            name : req.user.username, 
            handle: req.user.handle,
            email: req.user.email,
        });
    } catch(error){
        res.status(500).json({"message" : "internal server Error"});
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}