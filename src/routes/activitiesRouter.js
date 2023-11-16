const express = require("express");
const router = express.Router();

const {
  getAllActivities,
  saveActivity,
} = require("../controllers/activitiesController");

// @route   GET /api/v1/activities
router.get("/", getAllActivities);

// @route   POST /api/v1/activities/create
router.post("/create", saveActivity);

module.exports = router;
