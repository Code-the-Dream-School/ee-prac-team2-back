const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authHandler");

const { updateVote } = require("../controllers/votesController");

// @route   PUT /api/v1/votes/:activityID
router.put("/:activityID", authenticateUser, updateVote);

module.exports = router;
