const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const { name, phone, email, password, confirmPassword } = req.body;
    const nameMatch = /^[A-Za-z0-9]*$/;
    const emailMatch =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const passwordMatch =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!name.match(nameMatch)) {
      return res.status(400).json({ message: "please enter a valid name" });
    }
    if (!email.match(emailMatch)) {
      return res.status(400).json({ message: "please enter a valid email" });
    }
    if (!password.match(passwordMatch)) {
      return res.status(400).json({ message: "please enter a valid password" });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "password and confirm password are not the same" });
    }
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
};

const signIn = async (req, res) => {
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
    const token = jwt.sign({ id: user._id }, process.env.SECRET);
    const name = user.name;
    res.json({
      message: "login successfully",
      token,
      name,
      statusCode: 200,
      status: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signUp, signIn };
