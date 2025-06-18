import passport from 'passport';
import GoogleStrategy from "passport-google-oauth20"
import User from '../models/user.model.js';
import dotenv from "dotenv";
dotenv.config();
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback'
},
async function (accessToken, refreshToken , profile, cb) {
    try {
        const email = profile.emails?.[0]?.value;
        const username = profile.displayName;
        let user = await User.findOne({ provider: "google", email });
        // sign the user up
        if (!user) {
            user = new User({
                provider: "google",
                email,
                username
            });
            await user.save();
        }
        // success
        return cb(null, user);
    } catch (err) {
        return cb(err);
    }
}));