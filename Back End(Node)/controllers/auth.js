const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, Entered Data is Incorrect!");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, name, password: hashedPassword });
    const newUser = await user.save();
    res
      .status(201)
      .json({ message: "User Created Successfully!", userId: newUser._id });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

exports.logIn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, Entered Data is Incorrect!");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error(`User With ${email} is Not Available!`);
      error.statusCode = 401;
      throw error;
    }
    const isTrue = await bcrypt.compare(password, user.password);
    if (!isTrue) {
      const error = new Error("User Entered Wrong Password!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "someSuperSecretSecret",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, userId: user._id.toString() });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};
