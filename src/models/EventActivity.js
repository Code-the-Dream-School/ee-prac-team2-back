const mongoose = require("mongoose");

const eventActivitiesSchema = new mongoose.Schema(
  {
    eventID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    activity: {
      type: String,
      required: [true, "please provide a brief description for the activity!"],
    },
    type: {
      type: String,
      default: "a default activity type",
    },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventActivity", eventActivitiesSchema);
