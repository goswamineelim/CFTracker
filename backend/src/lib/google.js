import passport from 'passport';
import GoogleStrategy from "passport-google-oauth20";
import User from '../models/user.model.js';
import dotenv from "dotenv";
dotenv.config();
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'https://cftracker.onrender.com/api/auth/google/callback',
},
async function (accessToken, refreshToken, profile, cb) {
  try {
    const email = profile.emails?.[0]?.value;
    const username = profile.displayName;
    const avatar = profile.photos?.[0]?.value;

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.provider !== "google") {
      return cb(null, false, {
        message: "Account already exists with this email. Please log in manually.",
      });
    }

    if (existingUser && existingUser.provider === "google") {
      return cb(null, existingUser);
    }

    const newUser = new User({
      provider: "google",
      email,
      username,
      avatar,
    });

    await newUser.save();
    return cb(null, newUser);
  } catch (err) {
    return cb(err);
  }
}));
