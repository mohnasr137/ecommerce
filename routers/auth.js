const express = require("express");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();

//sign up
authRouter.post("/signUp", async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "the user with same email already exists!" });
    }
    const hashedPassword = await bcryptjs.hash(password, 8);
    let user = new User({
      name,
      phone,
      email,
      password: hashedPassword,
    });
    user = await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//sign in
authRouter.post("/signIn", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "the user with this email does not exist!" });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }
    const token = jwt.sign({ id: user._id }, "key");
    res.json({ token, ...user._doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = authRouter;
