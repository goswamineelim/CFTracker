// implement login and signup using codeforces
import express from "express";
import passport from "passport";
import { generateToken } from "../lib/token.js";
const router = express.Router();

// sends request to the google authentication server
router.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}));

// google redirects back here and we get the information we needed from google and we generate our own jwt token and do stateless authentication
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        generateToken(req.user._id, res);
        res.redirect('/');
    }
);

export default router;
