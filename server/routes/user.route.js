import express from "express";
import {
  forgotPasswordController,
  logincontroller,
  logoutController,
  resetPasswordController,
  signupcontroller,
} from "../controllers/user.controller.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", signupcontroller);

router.post("/login", logincontroller);

router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password/:token", resetPasswordController);

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(404).json({ status: false, message: "No Token" });
    }
    const decoded = await jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(404).json({ message: "Error Verify Token" });
  }
};

router.get("/verify", verifyUser, (req, res) => {
  return res.json({ status: true, message: "Authhorized" });
});

router.get("/logout", logoutController);

export default router;
