const Activity = require("../models/Activity");
const Event = require("../models/Event");
const EventActivity = require("../models/EventActivity");

// @desc    Endpoint for fetching pre-saved activities
// @route   GET /api/v1/activities
// @access  public
const getAllActivities = async (req, res) => {
  const response = await Activity.find();

  return res.json({ count: response.length, activities: response });
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

// @desc    Endpoint for creating an event activity
// @route   POST /api/v1/activities
//          POST /api/v1/activities?dummy=true
// @access  public
const saveActivity = async (req, res) => {
  const { eventID, activity, type } = req.body;
  const { dummy } = req.query;

  if (!activity) {
    res.status(400);
    throw new Error(
      "An 'activity' value containing a brief description for the activity must be provided!"
    );
  } else if (!type) {
    res.status(400);
    throw new Error("A 'type' value must be provided!");
  }

  if (dummy) {
    const savedActivity = await Activity.create({
      activity,
      type,
    });

    return res.json({ msg: "Activity saved as dummy data!", savedActivity });
  } else {
    if (!eventID) {
      res.status(400);
      throw new Error(
        "A valid 'eventID' value must be provided in order to link the activity to its event!"
      );
    }
    const savedActivity = await EventActivity.create({
      eventID,
      activity,
      type,
    });

    await Event.updateOne(
      { _id: savedActivity.eventID },
      { $push: { activities: savedActivity._id } }
    );
    return res.json({
      msg: `Activity saved in event with ID ${eventID}!`,
      savedActivity,
    });
  }
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
  const { userID } = req.user;
  let activity = await EventActivity.findOne({ _id });
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
    totalVotes: activity.votes.length,
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
