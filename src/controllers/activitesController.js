const Activity = require("../models/Activity");

// @desc    Endpoint for fetching all activities
// @route   GET /api/v1/activites
// @access  public
const getAllActivities = async (req, res) => {
  const response = await Activity.find();

  return res.json({ count: response.length, activities: response });
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

// @desc    Endpoint for updating the vote tally of an activity
// @route   PUT /api/v1/activites/votes/update/:_id
// @access  public
const updateActivityVote = async (req, res) => {
  const { _id } = req.params;
  const { tally } = req.body;
  if (!tally || isNaN(tally)) {
    res.status(400);
    throw new Error("An integer vote tally value must be provided!");
  } else if (tally !== 1 && tally !== -1) {
    res.status(400);
    throw new Error(
      "Provide 1 to increase, and -1 to decrease the vote tally!"
    );
  }

  const activity = await Activity.findOne({ _id });
  if (activity) {
    let vote = activity.votes;
    if (vote > 0 || tally === 1) {
      activity.votes = vote + tally;
      await activity.save();
    } else {
      res.status(400);
      throw new Error("Vote tally cannot be lowered than 0!");
    }
  } else {
    res.status(404);
    throw new Error(`Activity with ${_id} ID does not exist!`);
  }

  return res.json({ msg: "Vote tally updated!", activity });
};

module.exports = { getAllActivities, saveActivity, updateActivityVote };
