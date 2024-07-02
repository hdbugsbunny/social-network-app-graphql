const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const userController = require("../controllers/user");
const isAuth = require("../middleware/isAuth");

//* GET /user/getUserStatus
router.get("/getUserStatus", isAuth, userController.getUserStatus);

//* PATCH /user/postUserStatus
router.patch(
  "/postUserStatus",
  isAuth,
  [body("status").trim().not().isEmpty()],
  userController.updateUserStatus
);

module.exports = router;
