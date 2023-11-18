const Activity = require("../models/Activity");

// @desc    Endpoint for fetching all activities
// @route   GET /api/v1/activities
// @access  public
const getAllActivities = async (req, res) => {
  const response = await Activity.find().populate("votes");

  return res.json({ count: response.length, activities: response });
};

// @desc    Endpoint for creating an activity
// @route   POST /api/v1/activities
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

// @desc    Endpoint for updating the vote tally of an activity
// @route   PUT /api/v1/activities/:_id
// @access  public
const updateActivity = async (req, res) => {
  const { _id } = req.params;
  const { name, description, category } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("New activity name must be provided!");
  } else if (!category) {
    res.status(400);
    throw new Error("New activity category must be provided!");
  }

  const newActivityInfo = {
    name,
    description,
    category,
  };

  const updatedActivity = await Activity.findOneAndUpdate(
    { _id },
    newActivityInfo,
    { new: true, runValidators: true }
  );
  if (!updatedActivity) {
    res.status(404);
    throw new Error(`Activity with ${_id} ID does not exist!`);
  }

  return res.json({ msg: "Activity updated!", updatedActivity });
};

module.exports = { getAllActivities, saveActivity, updateActivity };
