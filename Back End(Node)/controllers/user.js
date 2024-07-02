const User = require("../models/user");

exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User Not Found!");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      message: "User Status Fetched Successfully!",
      status: user.status,
    });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  const { status } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User Not Found!");
      error.statusCode = 404;
      throw error;
    }
    user.status = status;
    await user.save();
    res.status(200).json({
      message: "User Status Updated Successfully!",
      status,
    });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};
