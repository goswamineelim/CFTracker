// implement login and signup using codeforces
import express from "express";
import passport from "passport";
import { generateToken } from "../lib/token.js";
const router = express.Router();

router.get('/google', passport.authenticate('google', {
    scope: ['openid', 'email', 'profile']
}));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Token generation or redirect to frontend with session/token
        generateToken(req.user._id, res);
        res.redirect('/');
    }
);

export default router;
