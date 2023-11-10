const express = require("express");
const router = express.Router();

const {
  getAllActivities,
  saveActivity,
} = require("../controllers/activityController");

// @route   GET /api/v1/activity
router.get("/", getAllActivities);

// @route   POST /api/v1/activity/create
router.post("/create", saveActivity);

module.exports = router;
