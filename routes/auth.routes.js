import express from "express";
import {
    loginPage, signupPage, signup, login, logout
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/login", loginPage);
router.get("/signup", signupPage);
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

export default router;
