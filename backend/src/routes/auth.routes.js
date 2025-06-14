// implement login and signup using codeforces
import express from "express";
import {signup, login, logout, validate} from "../controllers/auth.controller.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/validate", validate);
router.post("/logout", logout);

export default router;
