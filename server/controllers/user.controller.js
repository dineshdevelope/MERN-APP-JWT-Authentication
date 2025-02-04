import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const signupcontroller = async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(403).json({ message: "User Already Exit" });
  }
  const hashpassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashpassword,
  });
  await newUser.save();
  return res.status(201).json({ status: true, message: "User Created" });
};

export const logincontroller = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not Registered" });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(404).json({ message: "Password not match" });
  }
  const token = jwt.sign({ username: user.username }, process.env.JWT_KEY, {
    expiresIn: "1h",
  });
  res.cookie("token", token, { httpOnly: true, maxAge: 360000 });
  return res.json({ status: true, message: "Login Sucessfull" });
};

export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not registered" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dineshindevelope@gmail.com",
        pass: process.env.GMAIL_PASS,
      },
    });

    const sendMail = async () => {
      const mail = await transporter.sendMail({
        from: "dineshindevelope@gmail.com",
        to: email,
        subject: "Reset Password",
        text: `Click the link to reset your password: http://localhost:5173/reset-password/${token}`,
      });
      console.log("Reset Mail Sended");
    };

    try {
      sendMail();
      res
        .status(201)
        .json({ status: true, message: "Reset mail send Sucessfull" });
    } catch (error) {
      console.error(error);
      res.status(404).json({ message: "Error Sending Email" });
    }
  } catch (error) {
    console.error(error);
  }
};

export const resetPasswordController = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const decode = await jwt.verify(token, process.env.JWT_KEY);
    const id = decode.id;
    const hashPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate({ _id: id }, { password: hashPassword });
    return res
      .status(201)
      .json({ status: true, message: "Password Reset Sucessfull" });
  } catch (error) {
    res.status(404).json({ message: "Error in ResetPassword Controller" });
  }
};

export const logoutController = (req, res) => {
  res.clearCookie("token");
  return res.json({ status: true });
};
