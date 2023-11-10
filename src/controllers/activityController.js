const Activity = require("../models/Activity");

// @desc    Endpoint for fetching all activities
// @route   GET /api/v1/activity
// @access  public
const getAllActivities = async (req, res) => {
  const response = await Activity.find();

  return res.json({ count: response.length, activites: response });
};

// @desc    Endpoint for creating an activity
// @route   POST /api/v1/activity/create
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

module.exports = { getAllActivities, saveActivity };
