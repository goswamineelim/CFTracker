import User from "../models/user.model.js";

const signupTracker = {}

// validating the account for the user
export const validate = async (req, res) => {
  const contestId = 2041;
  const problemIndex = "D";
  const { handle } = req.body;
  const userId = req.user._id;

  if (!handle) {
    return res.status(400).json({ message: "Handle not provided" });
  }

  const url = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10`;

  try {
    const tracked = signupTracker[handle];

    if (!tracked) {
      return res.status(400).json({
        message: "No signup started for this handle or signup expired",
      });
    }

    const { startTime } = tracked;

    const resp = await fetch(url);
    const data = await resp.json();

    if (data.status !== "OK") {
      return res.status(400).json({
        message: "Invalid handle: " + (data.comment || "User not found"),
      });
    }

    for (const subProb of data.result) {
      const prob = subProb.problem;

      if (
        prob.contestId === contestId &&
        prob.index === problemIndex &&
        subProb.verdict === "COMPILATION_ERROR" &&
        subProb.creationTimeSeconds >= startTime
      ) {
        await User.findByIdAndUpdate(userId, { handle });

        clearTimeout(tracked.timeoutId);
        delete signupTracker[handle];

        return res.status(201).json({
          _id: userId,
          handle,
        });
      }
    }

    return res.status(400).json({
      message: `No matching submission found. Submit a compilation error to problem ${contestId}${problemIndex}`,
    });
  } catch (error) {
    console.error("Validation Error:", error.message);
    return res.status(500).json({ message: "Internal Server Issue" });
  }
};

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
        }, 5 * 60 * 1000); // 5 minutes
        signupTracker[handle] = { startTime, timeoutId };
        return res.status(200).json({
            handle,
        })

    } catch(error){
        return res.status(500).json({"message" : "error in signup"});
    }
}
//check handle exists or not
 
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


