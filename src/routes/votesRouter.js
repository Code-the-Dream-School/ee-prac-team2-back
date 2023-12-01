const express = require("express");
const router = express.Router();

const { updateVote } = require("../controllers/votesController");

// @route   PUT /api/v1/votes/:activityID
router.put("/:activityID", updateVote);

module.exports = router;
