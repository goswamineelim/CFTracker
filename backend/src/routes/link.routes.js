// linking the codeforces account
import express from "express";
import {link, validate,disconnect,checkHandleExists} from "../controllers/link.controller.js"
import { protectRoute } from "../middleware/isAuth.js";

const router = express.Router();

// can't link your account if you don't sign up
router.post("/link", protectRoute,  link);
router.post("/validate", protectRoute, validate);
router.post("/disconnect", protectRoute, disconnect);
router.post("/validateIfExists",protectRoute,checkHandleExists);

export default router;
