const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/isAuth");

//* GET /feed/posts
router.get("/posts", isAuth, feedController.getPosts);

//* GET /feed/posts/:postId
router.get("/posts/:postId", isAuth, feedController.getPost);

//* POST /feed/createPost
router.post(
  "/createPost",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

//* PUT /feed/posts/:postId
router.put(
  "/posts/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

//* DELETE /feed/posts/:postId
router.delete("/posts/:postId", isAuth, feedController.deletePost);

module.exports = router;
