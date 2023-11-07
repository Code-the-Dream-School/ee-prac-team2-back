const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide an event name!"],
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      unique: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    date: {
      type: Date,
    },
    votes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);