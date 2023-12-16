const express = require("express");

const router = express.Router();

const {
  getAllGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
} = require("../controllers/groupsController");

// @route   GET /api/v1/groups
router.get("/", getAllGroups);

// @route   GET /api/v1/groups/:_id
router.get("/:_id", getGroup);

// @route   POST /api/v1/groups
router.post("/", createGroup);

// @route   PUT /api/v1/groups/:_id
router.put("/:_id", updateGroup);

// @route   DELETE /api/v1/groups/:_id
router.delete("/:_id", deleteGroup);

module.exports = router;
