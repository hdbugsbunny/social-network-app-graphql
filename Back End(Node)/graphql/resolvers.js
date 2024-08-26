const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports = {
  createUser: async function ({ userInput }, req) {
    const { email, name, password } = userInput;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error(`User ${name} already exists`);
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, name, password: hashedPassword });
    const createdUser = await newUser.save();

    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
};
