import User from "../models/user.model.js";
import bcrypt from "bcrypt";

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
    res.status(404).json({ message: "User not Registered" });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(404).json({ message: "Password not match" });
  }
};
