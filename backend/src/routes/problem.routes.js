import express from "express";
import { addProblem, getProblems, deleteProblemByContestAndIndex,getByTags,searchProblemByName} from "../controllers/problem.controller.js";
import { protectRoute } from "../middleware/isAuth.js";
import { refreshProblemStates } from "../controllers/problem.controller.js";
import { getAllProblems } from "../controllers/problem.controller.js";
const router = express.Router();

// Add a new problem by link
router.post("/add", protectRoute, addProblem);
//  Get all unsolved problems for the user
router.get("/uns", protectRoute, getProblems);
// Delete a problem by problem index and contest id
router.delete("/contest/:contestID/index/:problemIndex", protectRoute, deleteProblemByContestAndIndex);
//Updates unsolved to solved
router.post("/refresh", protectRoute, refreshProblemStates);
// useless routes
// returns all the problems
router.get("/", protectRoute, getAllProblems);
//returns  usolved problems with matching tags
router.post("/by-tags", protectRoute, getByTags);
//returns problem with same name in DB
router.get('/search/user', protectRoute, searchProblemByName);
export default router;
