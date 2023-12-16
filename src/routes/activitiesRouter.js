const express = require("express");

const router = express.Router();

const {
  getAllActivities,
  saveActivity,
  updateActivity,
  updateActivityVote,
  getActivity,
  deleteActivity,
} = require("../controllers/activitiesController");

const { authenticateUser } = require("../middleware/authHandler");

// @route   GET /api/v1/activities
router.get("/", getAllActivities);

// @route   GET /api/v1/activities/:_id
router.get("/:_id", getActivity);

// @route   POST /api/v1/activities
router.post("/", saveActivity);

// @route   PUT /api/v1/activities/:_id
router.put("/:_id", updateActivity);

// @route   DELETE /api/v1/activities/:_id
router.delete("/:_id", deleteActivity);

// @route   PUT /api/v1/activities/:_id/votes
router.put("/:_id/votes", authenticateUser, updateActivityVote);

module.exports = router;
