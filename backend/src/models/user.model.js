import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: false,
        },
        handle: {
            type: String,  // Codeforces handle
            unique: false,
        },
        avatar: {
            type: String, // Can be used for general avatar (e.g., Google, GitHub avatar)
            required: false,
        },
        cfAvatar: {
            type: String, // Specifically Codeforces avatar
            required: false,
        },
        cfRating: {
            type: Number, // Codeforces rating
            required: false,
            default: 0,
        },
        cfRank: {
            type: String, // Codeforces rank (e.g., 'pupil', 'specialist')
            required: false,
            default: "unrated",
        },
        provider: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
