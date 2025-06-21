import Problem from "../models/problem.model.js";
import User from "../models/user.model.js";


export const addProblem = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user.handle) {
      return res.status(403).json({ message: "Please link your Codeforces handle before adding problems" });
    }

    const { problemLink } = req.body;
if (
  !problemLink ||
  (
    !problemLink.includes("codeforces.com/contest/") &&
    !problemLink.includes("codeforces.com/problemset/problem/") &&
    !problemLink.includes("codeforces.com/gym/")
  )
)   {
      return res.status(400).json({ message: "Invalid Codeforces problem link" });
    }

    // Extract contestId and problemIndex from the link
const match = problemLink.match(/(?:contest|problemset|gym)\/(\d+)\/problem\/([A-Z0-9]+)/i);
if (!match) {
  return res.status(400).json({ message: "Unable to extract contest ID and problem index" });
}

    const contestID = parseInt(match[1]);
    const problemIndex = match[2].toUpperCase();

    const exists = await Problem.findOne({ userId, contestID, problemIndex });
    if (exists) return res.status(400).json({ message: "Problem already added" });

    const resp = await fetch(`https://codeforces.com/api/problemset.problems`);
    const data = await resp.json();

    if (data.status !== "OK") {
      return res.status(500).json({ message: "Codeforces API error" });
    }

    const problemList = data.result.problems;
    const matched = problemList.find(
      p => p.contestId === contestID && p.index === problemIndex
    );

    const name = matched ? matched.name : "Unknown Problem";
    const tags = matched?.tags || [];

    const newProblem = new Problem({
      userId,
      contestID,
      problemIndex,
      problemLink,
      problemState: "U", // Unsolved
      name,
      tags,
    });

    await newProblem.save();

    return res.status(200).json({
      message: "Problem added successfully",
      problem: {
        _id: newProblem._id,
        contestID,
        problemIndex,
        name,
        tags,
        problemLink,
        problemState: "U",
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//gets unsolved problems and also marks the solved problems  as "S" in DB

export const getProblems = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const handle = user.handle;

    // Fetch latest submissions from Codeforces + all user problems (U and S)
    const [resp, allProblems] = await Promise.all([
      fetch(`https://codeforces.com/api/user.status?handle=${handle}`),
      Problem.find({ userId }).lean(),
    ]);

    const data = await resp.json();

    if (data.status !== "OK") {
      return res.status(500).json({ message: "Codeforces API error" });
    }

    // Create a set of solved problem IDs from Codeforces
    const solvedSet = new Set();
    for (const submission of data.result) {
      if (submission.verdict === "OK") {
        const key = submission.problem.contestId + submission.problem.index;
        solvedSet.add(key);
      }
    }

    const updated = [];
    const unsolvedProblems = [];

    for (const p of allProblems) {
      const key = p.contestID + p.problemIndex;

      if (solvedSet.has(key)) {
        if (p.problemState !== "S") {
          // Mark as solved in DB if not already
          updated.push(p._id);
        }
      } else {
        // Only return unsolved ones to frontend
        if (p.problemState === "U") {
          unsolvedProblems.push({
            _id: p._id,
            contestID: p.contestID,
            problemIndex: p.problemIndex,
            name: p.name,
            tags: p.tags,
            problemLink: p.problemLink,
            problemState: p.problemState,
          });
        }
      }
    }

    // Batch update solved problems
    if (updated.length > 0) {
      await Problem.updateMany(
        { _id: { $in: updated } },
        { $set: { problemState: "S" } }
      );
    }

    return res.status(200).json({ unsolvedProblems });

  } catch (error) {
    console.error("Error in getProblems:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


//deletes problems by problem index and contest id of the problem

export const deleteProblemByContestAndIndex = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user.handle) {
      return res.status(403).json({ message: "Please link your Codeforces handle before deleting problems" });
    }

    const { contestID, problemIndex } = req.params;

    if (!contestID || !problemIndex) {
      return res.status(400).json({ message: "contestID and problemIndex are required" });
    }

    const deleted = await Problem.findOneAndDelete({
      userId,
      contestID: parseInt(contestID),
      problemIndex: problemIndex.toUpperCase(),
    });

    if (!deleted) {
      return res.status(404).json({ message: "No such problem found for this user" });
    }

    return res.status(200).json({ message: "Problem deleted successfully", deleted });
  } catch (error) {
    console.error("Delete problem error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// It will mark solved problems as "S" which are currently marked as "U" in Db

export const refreshProblemStates = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const handle = user.handle;

    if (!handle) {
      return res.status(400).json({ message: "Codeforces handle not linked" });
    }

    const url = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.status !== "OK") {
      return res.status(500).json({ message: "Codeforces API error" });
    }

    const solvedSet = new Set();
    for (const sub of data.result) {
      if (sub.verdict === "OK") {
        const key = `${sub.problem.contestId}${sub.problem.index}`;
        solvedSet.add(key);
      }
    }

    const userProblems = await Problem.find({ userId });
    const toUpdate = [];

    for (const p of userProblems) {
      const key = `${p.contestID}${p.problemIndex}`;
      if (solvedSet.has(key) && p.problemState !== "S") {
        toUpdate.push(p._id);
      }
    }

    if (toUpdate.length > 0) {
      await Problem.updateMany(
        { _id: { $in: toUpdate } },
        { $set: { problemState: "S" } }
      );
    }

    return res.status(200).json({ message: "Problem statuses refreshed successfully" });
  } catch (error) {
    console.error("Refresh error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// gets all the problems for a particular user

export const getAllProblems = async (req, res) => {
  try {
    const userId = req.user._id;

    const problems = await Problem.find({ userId }).lean(); // `lean()` includes all fields by default

    return res.status(200).json({ problems }); 
  } catch (error) {
    console.error("Error in getAllProblems:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//search by tags gets problems with matching tags(all the tags mentioned should be matched)
export const getByTags = async (req, res) => {
  try {
    const userId = req.user._id;
    const { tags } = req.body;

    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ message: "Please provide at least one tag" });
    }

    // Fetch all unsolved problems for the user
    const problems = await Problem.find({ userId, problemState: "U" }).lean();

    // Filter problems where ALL requested tags are present in the problem's tags
    const filtered = problems.filter(problem =>
      tags.every(tag => problem.tags.includes(tag))
    );

    return res.status(200).json({ problems: filtered });
  } catch (error) {
    console.error("Error in getByTags:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// search by name in db
 export const searchProblemByName = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Problem name is required" });
    }

    // Case-insensitive partial match
    const problems = await Problem.find({
      userId,
      name: { $regex: new RegExp(name, 'i') }
    });

    if (problems.length === 0) {
      return res.status(404).json({ message: "No matching problem found for this user" });
    }

    return res.status(200).json({ problems });
  } catch (error) {
    console.error("Search error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



