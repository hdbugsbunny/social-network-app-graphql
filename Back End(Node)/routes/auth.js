const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const User = require("../models/user");
const authController = require("../controllers/auth");

//* PUT /auth/signup
router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter a Valid Email!")
      .custom(async (email, { req }) => {
        const userDoc = await User.findOne({ email });
        if (userDoc) return Promise.reject("Email Already Exists!");
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signUp
);

//* POST /auth/login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter a Valid Email!")
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
  ],
  authController.logIn
);

module.exports = router;
