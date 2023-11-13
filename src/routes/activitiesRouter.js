const express = require("express");
const router = express.Router();

const {
  getAllActivities,
  saveActivity,
  updateActivityVote,
} = require("../controllers/activitesController");

// @route   GET /api/v1/activites
router.get("/", getAllActivities);

// @route   POST /api/v1/activites/create
router.post("/create", saveActivity);

// @route   PUT /api/v1/activites/votes/update/:_id
router.put("/votes/update/:_id", updateActivityVote);

module.exports = router;
