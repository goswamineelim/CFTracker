import Problem from "../models/problem.model.js";
import User from "../models/user.model.js";


export const addProblem = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const { problemLink } = req.body;
    let match;

    if (problemLink.includes("contest") || problemLink.includes("gym")) {
      // contest/123/problem/A or gym/123/problem/B
      match = problemLink.match(/\/(?:contest|gym)\/(\d+)\/problem\/([A-Za-z0-9]+)/);
    } else if (problemLink.includes("problemset/problem")) {
      // problemset/problem/2121/H
      match = problemLink.match(/\/problemset\/problem\/(\d+)\/([A-Za-z0-9]+)/);
    }



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
    const problemRating = matched?.rating ?? null; 
    const newProblem = new Problem({
      userId,
      contestID,
      problemIndex,
      problemLink,
      problemState: "unsolved", // Unsolved
      name,
      tags,
       problemRating, 
    });

    await newProblem.save();

    return res.status(200).json({
      problem: {
        _id: newProblem._id,
        contestID,
        problemIndex,
        name,
        tags,
        problemLink,
        problemState: "unsolved",
        problemRating, 
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const mark = async (req, res) => {
  try {
    const { problemIndex, contestID } = req.body;

    if (!problemIndex || !contestID) {
      return res.status(403).json({ message: "Problem Index or contest id missing" });
    }

    const userId = req.user._id;

    const problem = await Problem.findOne({
      userId: userId,
      contestID: contestID,
      problemIndex: problemIndex
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const newState = problem.problemState === "solved" ? "unsolved" : "solved";

    await Problem.updateOne(
      {
        userId: userId,
        contestID: contestID,
        problemIndex: problemIndex
      },
      {
        $set: {
          problemState: newState
        }
      }
    );

    return res.status(200).json({ message: `Problem marked as ${newState}` });

  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


//deletes problems by problem index and contest id of the problem

export const deleteProblemByContestAndIndex = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    const { contestID, problemIndex } = req.body;

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

    const [resp, allProblems] = await Promise.all([
      fetch(`https://codeforces.com/api/user.status?handle=${handle}`),
      Problem.find({ userId }).lean(),
    ]);
    const data = await resp.json();

    if (data.status !== "OK") {
      return res.status(500).json({ message: "Codeforces API error" });
    }

    const solvedSet = new Set();
    const ratingMap = new Map();

    for (const sub of data.result) {
      if (sub.verdict === "OK") {
        const key = `${sub.problem.contestId}${sub.problem.index}`;
        solvedSet.add(key);
        if (sub.problem.rating) {
          ratingMap.set(key, sub.problem.rating);
        }
      }
    }

    const toUpdate = [];
    const unsolvedProblems = [];

    for (const p of allProblems) {
      const key = p.contestID + p.problemIndex;
      let state = p.problemState;
      let rating = p.problemRating;

      if (solvedSet.has(key)) {
        if (p.problemState !== "solved") {
          state = "solved";
        }
      }

      if (ratingMap.has(key)) {
        const newRating = ratingMap.get(key);
        if (p.problemRating !== newRating) {
          rating = newRating;
        }
      }

      if (state !== p.problemState || rating !== p.problemRating) {
        toUpdate.push({
          _id: p._id,
          updates: {
            ...(state !== p.problemState && { problemState: state }),
            ...(rating !== p.problemRating && { problemRating: rating }),
          },
        });
      }

      unsolvedProblems.push({
        _id: p._id,
        contestID: p.contestID,
        problemIndex: p.problemIndex,
        name: p.name,
        tags: p.tags,
        problemLink: p.problemLink,
        problemState: state,
        problemRating: rating || null,
      });
    }

    if (toUpdate.length > 0) {
      const bulkOps = toUpdate.map(({ _id, updates }) => ({
        updateOne: {
          filter: { _id },
          update: { $set: updates },
        },
      }));
      await Problem.bulkWrite(bulkOps);
    }

    return res.status(200).json({ unsolvedProblems });
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




