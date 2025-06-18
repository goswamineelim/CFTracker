import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username : {
            type: String,
            required: true
        },
        password : {
            type: String,
            required: false,
        },
        handle : {
            type: String,
            unique: false,
        },
        avatar : {
            type: String,
            required: false,
        },
        provider : {
            type: String,
            required: true,
        },
    },
    {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;