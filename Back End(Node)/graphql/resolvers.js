const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Post = require("../models/post");

module.exports = {
  createUser: async function ({ userInput }, req) {
    const { email, name, password } = userInput;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: "Please Enter a Valid Email!" });
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      errors.push({ message: "Password Must be at Least 5 Characters!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid Input!");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error(`User ${email} already exists`);
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, name, password: hashedPassword });
    const createdUser = await newUser.save();

    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  loginUser: async function ({ email, password }) {
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

    return { token: token, userId: user._id.toString() };
  },
  createPost: async function ({ postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("User Not Authenticated");
      error.code = 401;
      throw error;
    }

    const { title, content, imageUrl } = postInput;
    const errors = [];
    if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
      errors.push({ message: "Title Must be at Least 5 Characters!" });
    }
    if (
      validator.isEmpty(content) ||
      !validator.isLength(content, { min: 5 })
    ) {
      errors.push({ message: "Content Must be at Least 5 Characters!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid Input!");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const creator = await User.findById(req.userId);
    if (!creator) {
      const error = new Error("Invalid User!");
      error.code = 401;
      throw error;
    }

    const newPost = new Post({ title, content, imageUrl, creator });
    const createdPost = await newPost.save();
    creator.posts.push(createdPost);
    await creator.save();

    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },
  userPosts: async function ({ page }, req) {
    if (!req.isAuth) {
      const error = new Error("User Not Authenticated");
      error.code = 401;
      throw error;
    }

    if (!page) {
      page = 1;
    }
    const perPage = 2;

    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("creator");

    return {
      posts: posts.map((p) => ({
        ...p._doc,
        _id: p._id.toString(),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      totalPosts,
    };
  },
  userPost: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error("User Not Authenticated");
      error.code = 401;
      throw error;
    }

    const post = await Post.findById(id).populate("creator");
    if (!post) {
      const error = new Error(`Post ${id} not found`);
      error.code = 404;
      throw error;
    }

    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },
};
