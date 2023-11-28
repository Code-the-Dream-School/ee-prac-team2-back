const User = require("../models/User");
const generateCookie = require("../utilities/generateCookie");

// @desc    creates a 'token cookie' and creates a new user
// @route   POST /api/v1/auth/signup
// @access  public
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    res.status(400);
    throw new Error("Please provide, name, email and password!");
  } else if (await User.findOne({ email })) {
    res.status(400);
    throw new Error(`User with ${email} email already exists!`);
  }

  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  generateCookie({ res, token });
  res
    .status(201)
    .json({
      msg: "Signed up successfully!",
      user: { ...user._doc, password: undefined },
    });
};

module.exports = { signup };
