const axios = require("axios");
const Activity = require("../models/Activity");
const Event = require("../models/Event");
const EventActivity = require("../models/EventActivity");

// @desc    Endpoint for fetching all activities
// @routes  GET /api/v1/activities
// @access  public
const getAllActivities = async (req, res) => {
  let suggestedActivities = [];

  for (let i = 0; i < 3; i++) {
    const apiResponse = await axios.get(
      `https://www.boredapi.com/api/activity?participants=${i + 1}`
    );
    suggestedActivities.push(apiResponse.data);
  }
  suggestedActivities = suggestedActivities.map((element) => ({
    _id: element.key,
    activity: element.activity,
    type: element.type,
  }));

  const hardCodedActivities = await Activity.aggregate([
    { $sample: { size: 3 } },
    {
      $project: {
        activity: 1,
        type: 1,
        _id: 1,
      },
    },
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

// @desc    Endpoint for creating an pre-saved activity
// @route   POST /api/v1/activities
// @access  public
const saveActivity = async (req, res) => {
  const { activity, type } = req.body;

  if (!activity) {
    res.status(400);
    throw new Error(
      "An 'activity' value containing a brief description for the activity must be provided!"
    );
  }
  if (!type) {
    res.status(400);
    throw new Error("A 'type' value must be provided!");
  }

  const savedActivity = await Activity.create({
    activity,
    type,
  });

  return res.json({ msg: "Activity saved as dummy data!", savedActivity });
};

// @desc    Endpoint for updating an event activity
// @route   PUT /api/v1/activities/:_id
// @access  public
const updateActivity = async (req, res) => {
  const { _id } = req.params;
  const { activity, type } = req.body;
  if (!activity) {
    res.status(400);
    throw new Error(
      "New 'activity' value containing a brief description for the activity must be provided!"
    );
  } else if (!type) {
    res.status(400);
    throw new Error("New 'type' value must be provided!");
  }

  const newActivityInfo = {
    activity,
    type,
  };

  const updatedActivity = await EventActivity.findOneAndUpdate(
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

// @desc    Endpoint for deleting an event activity
// @route   DELETE /api/v1/activities/:_id
// @access  public
const deleteActivity = async (req, res) => {
  const { _id } = req.params;
  const activity = await EventActivity.findOneAndDelete({ _id });
  if (!activity) {
    res.status(404);
    throw new Error(`Activity with ${_id} ID does not exist!`);
  }

  await Event.updateOne(
    { _id: activity.eventID },
    { $pull: { activities: activity._id } }
  );

  return res.json({ msg: `Successfully removed activity with ID: ${_id}` });
};

// @desc    Endpoint for updating the vote tally of an event activity
// @route   PUT /api/v1/activities/:_id/votes
// @access  signed in users only
const updateActivityVote = async (req, res) => {
  const { _id } = req.params;
  const userID = req.user._id;
  const activity = await EventActivity.findOne({ _id });
  if (activity) {
    if (activity.votes.includes(userID)) {
      activity.votes.pull(userID);
    } else {
      activity.votes.push(userID);
    }
    await activity.save();
  } else {
    res.status(404);
    throw new Error(`Activity with ${_id} ID does not exist!`);
  }

  return res.json({
    msg: "Vote tally updated!",
    activity,
  });
};

module.exports = {
  getAllActivities,
  getActivity,
  saveActivity,
  updateActivity,
  deleteActivity,
  updateActivityVote,
};
