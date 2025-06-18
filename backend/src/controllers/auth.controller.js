import User from "../models/user.model.js";
import { generateToken } from "../lib/token.js";
import passport from "passport";
import GoogleStrategy from "passport-google-oidc";
import dotenv from "dotenv";
dotenv.config();


// export const signup = async (req, res) => {

// }

// export const login = async (req, res) => {

// }

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

export const logout = () => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}