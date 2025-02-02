import express from "express";
import {
  logincontroller,
  signupcontroller,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", signupcontroller);

router.post("/login", logincontroller);

export default router;
