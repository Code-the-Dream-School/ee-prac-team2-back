const express = require("express");
const router = express.Router();

const {
  getAllActivities,
  saveActivity,
  updateActivity
} = require("../controllers/activitiesController");

// @route   GET /api/v1/activities
router.get("/", getAllActivities);

// @route   POST /api/v1/activities
router.post("/", saveActivity);

// @route   PUT /api/v1/activities/:_id
router.put("/:_id", updateActivity);

module.exports = router;
