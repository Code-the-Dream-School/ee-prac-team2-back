const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    activityID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vote", voteSchema);
