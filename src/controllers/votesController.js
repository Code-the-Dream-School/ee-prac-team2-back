const Vote = require("../models/Vote");

// @desc    Update vote count of a specific activity
// @route   PUT /api/v1/votes/:activityID
// @access  public
const updateVote = async (req, res) => {
  const { activityID } = req.params;
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
  const activityVote = await Vote.findOne({ activity: activityID });
  if (activityVote) {
    let count = activityVote.count;
    if (count > 0 || tally === 1) {
      activityVote.count = count + tally;
      await activityVote.save();
    } else {
      res.status(400);
      throw new Error("Vote tally cannot be lowered than 0!");
    }
  } else {
    res.status(404);
    throw new Error(
      `No vote reference found for activity with ${activityID} ID!`
    );
  }
  return res.json({
    msg: "Vote tally updated!",
    voteCount: activityVote.count,
  });
};

module.exports = { updateVote };
