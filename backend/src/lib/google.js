import passport from 'passport';
import GoogleStrategy from "passport-google-oidc"
import User from '../models/user.model.js';
import dotenv from "dotenv/config";

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback'
},
    async function (issuer , profile, cb) {
        try {
            const email = profile.emails?.[0]?.value;
            const username = profile.displayName;

            let user = await User.findOne({ provider: issuer, email });
            // sign the user up
            if (!user) {
                user = new User({
                    provider: issuer,
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

passport.serializeUser(function (user, done) {
    done(null, user._id); // or any unique identifier
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});