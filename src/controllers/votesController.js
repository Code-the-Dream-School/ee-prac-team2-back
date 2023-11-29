const Vote = require("../models/Vote");

// @desc    Update vote count of a specific activity
// @route   PUT /api/v1/votes/:activityID
// @access  signed in users only
const updateVote = async (req, res) => {
  const { activityID } = req.params;
  const { userID } = req.user;

  let activityVote = await Vote.findOne({ activityID });
  if (activityVote) {
    if (activityVote.users.includes(userID)) {
      activityVote.users = activityVote.users.filter(
        (userId) => userId === userID
      );
    } else {
      activityVote.users.push(userID);
    }
    await activityVote.save();
  } else {
    res.status(404);
    throw new Error(
      `No vote reference found for activity with ${activityID} ID!`
    );
  }

  return res.json({
    msg: "Vote tally updated!",
    voteCount: activityVote.users.length,
  });
};

module.exports = { updateVote };
