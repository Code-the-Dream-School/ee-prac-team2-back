const express = require("express");
const router = express.Router();

const { signup } = require("../controllers/authController");

// @route   POST /api/v1/auth/signup
router.post("/signup", signup);

module.exports = router;
