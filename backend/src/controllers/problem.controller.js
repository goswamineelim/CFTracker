import Problem from "../models/problem.model.js";
import User from "../models/user.model.js";

export const addProblem = async (req, res) => {
    try{
        const userId = req.user._id; // comes from middleware to check whether user is authenticated
        const {contestId, problemIndex, problemLink} = req.body;
        if(contestId && problemIndex && problemLink){
            const newProblem = new Problem({
                userId: userId,
                contestID: contestId,
                problemIndex: problemIndex,
                problemLink: problemLink,
                problemState: "U",
            });
            newProblem.save();
            return res.status(200).json({
                userId: userId,
                contestID: contestId,
                problemIndex: problemIndex,
                problemLink: problemLink,
                problemState: "U",
            });
        }
        else {
            return res.status(400).json({"message ": "please provide all data"});
        }
    } catch(error){ 
        return res.status(500).json({"message" : "error in Add Problem"});
    }
}

export const getProblems = async (req, res) => {
    try{
        const userId = req.user._id; // comes from middleware to check whether user is authenticated
        const user = await User.findOne({ _id: userId });
        const handle = user.handle;
        const [resp, Problems] = await Promise.all([
            fetch(`https://codeforces.com/api/user.status?handle=${handle}`),
            Problem.find({
                $and: [
                    { userId: userId },
                    { problemState: "U" },
                ],
            }).lean()
        ]);
        // efficient matching
        // uses hash set to check availability 
        const hashSet = new Set();
        const data = await resp.json();
        for(const Problems of data.result){
            if(Problems.verdict === "OK"){
                hashSet.add(Problems.problem.contestId + "" + Problems.problem.index);
            }
        }
        if(userId){
            const obj = [];
            const toDelete = [];
            for(const p of Problems){
                if(hashSet.has(p.contestID + "" + p.problemIndex)){
                    toDelete.push(p._id);
                }
                else {
                    obj.push({
                        _id: p._id, // filter
                        contestID: p.contestID,
                        problemIndex: p.problemIndex,
                        problemState: "U" 
                    })
                }
            }
            if (toDelete.length > 0) {
                await Problem.deleteMany({ _id: { $in: toDelete } });
            }
            return res.status(200).json({obj});
        }
        else {
            return res.status(400).json({"message ": "please provide problem link and problem id"});
        }
    } catch(error){
        return res.status(500).json({"message" : "error in Get Problem"});
    }
}