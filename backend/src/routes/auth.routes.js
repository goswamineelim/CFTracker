// implement login and signup using codeforces
import express from "express";
import passport from "passport";
import { generateToken } from "../lib/token.js";
const router = express.Router();
import {getInfo, login, logout, signup, verify,resendOTP} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/isAuth.js";

// sends request to the google authentication server
router.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

// google redirects back here and we get the information we needed from google and we generate our own jwt token and do stateless authentication
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login?error=email_exists' }),
    (req, res) => {
        generateToken(req.user._id, res);
        res.redirect('http://localhost:5173/');
    }
);

// Signup request from user(manually)
router.post("/signup", signup);

router.post("/resend", resendOTP);
//  Verify OTP
router.post("/verify", verify);

//  Login
router.post("/login", login);

router.get('/me',protectRoute, getInfo);

router.post('/logout', logout)
export default router;
