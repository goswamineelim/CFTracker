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
        otpStore[email] = {otp, timeoutId};

        sendEmail(
            email,
            "OTP Verification for CFTracker",
            `Your OTP is: ${otp}`
            ).catch((err) => {
            console.error("Error sending OTP email:", err);
        });
        res.status(201).json({
        message: "OTP generation initiated",
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

        if (!user)
            return res.status(400).json({ message: "Invalid credentials or unverified account" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials or unverified account" });

        generateToken(user._id, res);

        res.status(200).json({ 
            name: user.username,
            email: user.email,
            handle: user.handle,
            avatar: user.avatar,
        });
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
        return res.status(200).json({
            name: user.username,
            email: user.email,
            handle: user.handle,
            avatar: user.avatar,
        });
    } catch (err) {
        res.status(500).json({
            message: "Verification failed",
            error: err.message
        });
    }
}

export const resendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingOTP = otpStore[email];
    if (existingOTP) {
      clearTimeout(existingOTP.timeoutId);
      delete otpStore[email];
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const timeoutId = setTimeout(() => {
      delete otpStore[email];
    }, 5 * 60 * 1000); 

    otpStore[email] = { otp, timeoutId };

    sendEmail(
      email,
        "OTP Verification for CFTracker",
        `Your OTP is: ${otp}`
    ).catch((err) => {
      console.error("Error sending OTP email:", err);
    });

    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to resend OTP",
      error: err.message,
    });
  }
};

export const getInfo = async (req, res) => {
    try{
        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = await User.findById(req.user._id).select("-password"); // exclude password field

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
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