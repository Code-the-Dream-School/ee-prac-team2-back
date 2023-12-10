const express = require("express");
const router = express.Router();

const {
  getAllEvents,
  getEvent,
  saveEvent,
  getEventActivities,
  deleteEvent,
} = require("../controllers/eventsController");

// @route   GET /api/v1/events
router.get("/", getAllEvents);

// @route   GET /api/v1/events/:_id
router.get("/:_id", getEvent);

// @route   GET /api/v1/events/activities/:_id
router.get("/activities/:_id", getEventActivities);

// @route   POST /api/v1/events
router.post("/", saveEvent);

// @route   DELETE /api/v1/events/:_id
router.delete("/:_id", deleteEvent);

module.exports = router;
