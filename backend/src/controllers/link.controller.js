import User from "../models/user.model.js";

const signupTracker = {}

// validating the account for the user
export const validate =  async (req, res) => {
    let contestId = 2041;
    let problemIndex = "D"; // needs to be randomized
    const { handle } = req.body;
    const userId = req.user._id;
    if(!handle){
        return res.status(400).json({"message" : "handle not provided"});
    }
    const url = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10`;
    try{
        const tracked = signupTracker[handle];
        if (!tracked) {
            return res.status(400).json({ "message" : "No signup started for this handle or signup expired" });
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
                    await User.findByIdAndUpdate(
                        userId, 
                        { handle: handle },
                        { new: true } 
                    );
                    clearTimeout(tracked.timeoutId);
                    delete signupTracker[handle];
                    return res.status(201).json({
                        _id: userId,
                        handle: handle,
                    });
                }
            }
        }
        return res.status(400).json({ "message" : "No matching submission found" });;
    } catch(error){
        return res.status(500).json({"message" : "Internal Server Issue"});
    }
}

//get the handle from the body and then set a timeout for 5 mins before the object gets deleted and user needs to start again
export const link = async (req, res) => {
    const {handle} = req.body;
    try{
        if(!handle){
            return res.status(400).json({"message" : "please provide valid handle"});
        }
        const user = await User.findOne({ handle : handle });
        
        if(user) {
            return res.status(400).json({"message" : "handle already exists"});
        }
        const startTime = Math.floor(Date.now() / 1000);
        const timeoutId = setTimeout(() => {
            delete signupTracker[handle];
        }, 2 * 60 * 1000); // 2 minutes
        signupTracker[handle] = { startTime, timeoutId };
        return res.status(200).json({
            handle,
        })

    } catch(error){
        return res.status(500).json({"message" : "error in signup"});
    }
}
export const disconnect = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.handle) {
            return res.status(400).json({ message: "User has no handle connected" });
        }
        user.handle = undefined;
        await user.save();
        return res.status(200).json({ message: "Handle disconnected successfully" });
    } catch (error) {
        console.error("Error disconnecting handle:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
 
export const checkHandleExists = async (req, res) => {
  const { handle } = req.body;

  if (!handle) {
    return res.status(400).json({ message: "Handle is required" });
  }

  const url = `https://codeforces.com/api/user.info?handles=${handle}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && Array.isArray(data.result) && data.result.length > 0) {
      return res.status(200).json({ exists: true, handle });
    } else {
      return res.status(404).json({ exists: false, message: "Handle does not exist" });
    }
  } catch (error) {
    console.error("Error checking handle:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
