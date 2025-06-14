import User from "../models/user.model.js";
import { generateToken } from "../lib/token.js";

const signupTracker = {}

export const validate =  async (req, res) => {
    let contestId = 2041;
    let problemIndex = "D";
    const { handle } = req.body;
    const url = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10`;
    try{
        const tracked = signupTracker[handle];
        if (!tracked) {
            console.log(signupTracker);
            return res.status(400).json({ message: "No signup started for this handle or signup expired" });
        }
        const { startTime } = tracked;
        const resp = await fetch(url); // we use fetch api here 
        if(!resp.ok){
            return res.status(400).json({"message" : "CodeForces API problem"});
        }
        const data = await resp.json();
        for (const subProb of data.result){
            const prob = subProb.problem;
            if(prob.contestId === contestId && prob.index === problemIndex && subProb.verdict === "COMPILATION_ERROR"){
                if(startTime <= subProb.creationTimeSeconds){
                    const newUser = new User({
                        handle: handle,
                    });
                    if(newUser){
                        await newUser.save();
                        generateToken(newUser._id, res);
                        clearTimeout(tracked.timeoutId);
                        delete signupTracker[handle];
                        return res.status(201).json({
                            _id: newUser._id,
                            handle: handle,
                        });
                    }
                    else {
                        return res.status(400).json({"message" : "Invalid user handle"});
                    }
                }
            }
        }
        console.log(signupTracker);
        return res.status(400).json({ message: "No matching submission found" });;
    } catch(error){
        return res.status(500).json({"message" : "Internal Server Issue"});
    }
}

export const signup = async (req, res) => {
    const {handle} = req.body;
    try{
        if(!handle){
            return res.status(400).json({"message" : "please provide valid handle"});
        }
        const user = await User.findOne({ handle : handle });
        
        if(user) {
            return res.status(400).json({"message" : "email already exists"});
        }
        const startTime = Math.floor(Date.now() / 1000);
        const timeoutId = setTimeout(() => {
            delete signupTracker[handle];
        }, 5 * 60 * 1000); // 5 minutes
        signupTracker[handle] = { startTime, timeoutId };
        return res.status(200).json({
            handle,
        })

    } catch(error){
        return res.status(500).json({"message" : "error in signup"});
    }
}

export const login = async (req, res) => {
  const {handle} = req.body;
  try {
    const user = await User.findOne({handle});

    if(!user){
        return res.status(400).json({"message" : "No such handle found"});
    }
    
    generateToken(user._id, res);

    res.status(200).json({
        _id: user._id,
        handle : handle,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Error in Login" });
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