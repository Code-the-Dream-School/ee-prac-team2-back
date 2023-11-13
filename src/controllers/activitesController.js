const Activity = require("../models/Activity");

// @desc    Endpoint for fetching all activities
// @route   GET /api/v1/activites
// @access  public
const getAllActivities = async (req, res) => {
  const response = await Activity.find();

  return res.json({ count: response.length, activites: response });
};

// @desc    Endpoint for creating an activity
// @route   POST /api/v1/activites/create
// @access  public
const saveActivity = async (req, res) => {
  const { name, category, description, votes } = req.body;
  if (!name || !category) {
    res.status(400);
    throw new Error("Activity name and category must be provided!");
  }
  const savedActivity = await Activity.create({
    name,
    category,
    description,
    votes,
  });
  return res.json({ msg: "Activity saved!", savedActivity });
};

// @desc    Endpoint for creating an activity
// @route   POST /api/v1/activity/create
// @access  public
const updateActivityVote = async (req, res) => {
  const { _id } = req.params;
  const { newVote } = req.body;
  if (!newVote || isNaN(newVote)) {
    res.status(400);
    throw new Error("A new integer vote value must be provided!");
  }
  const updatedVote = await Activity.findOneAndUpdate(
    { _id },
    { votes: newVote },
    { new: true }
  );
  if (!updatedVote) {
    res.status(404);
    throw new Error(`Activity with ${_id} ID does not exist!`);
  }
  return res.json({ msg: "Vote tally updated!", updatedVote });
};

module.exports = { getAllActivities, saveActivity, updateActivityVote };
