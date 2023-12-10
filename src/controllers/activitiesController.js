const axios = require("axios");
const Activity = require("../models/Activity");

// @desc    Endpoint for fetching all activities
// @routes  GET /api/v1/activities
// @access  public
const getAllActivities = async (req, res) => {
  const suggestedActivities = [];

  for (let i = 0; i < 3; i++) {
    const apiResponse = await axios.get(
      `https://www.boredapi.com/api/activity?participants=${i + 1}`
    );
    suggestedActivities.push(apiResponse.data);
  }
  const hardCodedActivities = await Activity.aggregate([
    { $sample: { size: 3 } },
  ]);

  suggestedActivities.push(...hardCodedActivities);

  return res.json({
    count: suggestedActivities.length,
    activities: suggestedActivities,
  });
};

// @desc    Endpoint for fetching a single activity
// @route   GET /api/v1/activities/:_id
// @access  public
const getActivity = async (req, res) => {
  const { _id } = req.params;
  const activity = await Activity.findOne({ _id });
  if (!activity) {
    res.status(404);
    throw new Error(`Activity with ${_id} ID does not exist!`);
  }

  return res.json(activity);
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

// @desc    Endpoint for deleting a single activity
// @route   DELETE /api/v1/activities/:_id
// @access  public
const deleteActivity = async (req, res) => {
  const { _id } = req.params;
  const activity = await Activity.findOneAndDelete({ _id });
  if (!activity) {
    res.status(404);
    throw new Error(`Activity with ${_id} ID does not exist!`);
  }

  return res.json({ msg: `Successfully removed activity with ID: ${_id}` });
};

module.exports = {
  getAllActivities,
  getActivity,
  saveActivity,
  updateActivity,
  deleteActivity,
};
