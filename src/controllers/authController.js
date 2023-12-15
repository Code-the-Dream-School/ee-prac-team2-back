const User = require("../models/User");
const passport = require("passport");

// @desc    creates a new cookie with a session ID as its payload
// @route   POST /api/v1/auth/signup
// @access  public
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    res.status(400);
    throw new Error("Please provide, name, email and password!");
  }
  if (await User.findOne({ email })) {
    res.status(400);
    throw new Error(`User with ${email} email already exists!`);
  }

  const newUser = await User.create({ name, email, password });
  req.login(newUser, (err) => {
    if (err) {
      throw new Error(err);
    }
    res.status(201);
    return res.json({
      msg: "Signup and login successful!",
      user: { ...newUser._doc, password: undefined },
    });
  });
};

// @desc    creates a new cookie with a session ID as its payload
// @route   POST /api/v1/auth/login
// @access  public
const login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).json({ msg: "Incorrect email or password!" });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.json({
        msg: "Login successful!",
        user: { ...user._doc, password: undefined },
      });
    });
  })(req, res, next);
};

// @desc    destroys authenticated user's session payload
// @route   POST /api/v1/auth/logout
// @access  signed in users only
const logout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Error during logout" });
    }
    res.status(200).json({ msg: "Logged out!" });
  });
};

// @desc    get authenticated user's detail
// @route   GET /api/v1/auth/getCurrentUser
// @access  signed in users only
const getCurrentUser = async (req, res) => {
  const { user } = req.session.passport;

  const foundUser = await User.findOne({ _id: user });

  return res.json(foundUser);
};

module.exports = { signup, login, logout, getCurrentUser };
