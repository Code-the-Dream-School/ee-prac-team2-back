const express = require("express");
const router = express.Router();

const {
  getAllActivities,
  saveActivity,
  updateActivityVote,
} = require("../controllers/activityController");

// @route   GET /api/v1/activity
router.get("/", getAllActivities);

// @route   POST /api/v1/activity/create
router.post("/create", saveActivity);

// @route   PUT /api/v1/activity/vote/:_id
router.put("/vote/:_id", updateActivityVote);

module.exports = router;
