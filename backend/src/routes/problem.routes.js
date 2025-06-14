import express from "express"
import { addProblem, getProblems } from "../controllers/problem.controller.js";
import {protectRoute} from "../middleware/isAuth.js"
const router = express.Router();

router.post("/add",protectRoute, addProblem);
router.get("/",protectRoute, getProblems);

export default router;