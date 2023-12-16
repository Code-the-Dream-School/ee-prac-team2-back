const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/authController");

const { authenticateUser } = require("../middleware/authHandler");

// @route   POST /api/v1/auth/signup
router.post("/signup", signup);

// @route   POST /api/v1/auth/login
router.post("/login", login);

// @route   POST /api/v1/auth/logout
router.post("/logout", logout);

// @route   GET /api/v1/auth/getCurrentUser
router.get("/getCurrentUser", authenticateUser, getCurrentUser);

module.exports = router;
