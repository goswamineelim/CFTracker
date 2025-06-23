import express from "express";
import { addProblem, deleteProblemByContestAndIndex, mark} from "../controllers/problem.controller.js";
import { protectRoute } from "../middleware/isAuth.js";
import { refreshProblemStates } from "../controllers/problem.controller.js";
import { getAllProblems } from "../controllers/problem.controller.js";
const router = express.Router();

// Add a new problem by link
router.post("/add", protectRoute, addProblem);
// Delete a problem by problem index and contest id
router.delete("/delete", protectRoute, deleteProblemByContestAndIndex);
//Updates unsolved to solved
router.post("/ref", protectRoute, refreshProblemStates);
// returns all the problems
router.get("/", protectRoute, getAllProblems);
// marks specific problems unsolved to solved or solved to unsolved
router.put('/mark', protectRoute, mark);

export default router;
