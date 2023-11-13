const express = require("express");
const router = express.Router();

const {
  getAllActivities,
  saveActivity,
} = require("../controllers/activitesController");

// @route   GET /api/v1/activites
router.get("/", getAllActivities);

// @route   POST /api/v1/activites/create
router.post("/create", saveActivity);

module.exports = router;
