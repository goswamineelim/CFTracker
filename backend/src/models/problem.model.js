import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
    {
        userId : {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
            name:{
               type: String, 
               required: true,
            },
      
        contestID: {
            type: Number,
            required: true,
        },
        problemIndex: {
            type: String,
            required: true,
        },
        problemLink: {
            type: String,
            required: true,
        },
        problemState: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {timestamps: true}
);

const Problem = mongoose.model("Problem", problemSchema);
problemSchema.index({ userId: 1, problemState: 1 });
export default Problem;