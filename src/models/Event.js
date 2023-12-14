const Group = require("./Group");
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    groupID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    name: {
      type: String,
      required: [true, "please provide an activity name!"],
    },
    description: {
      type: String,
      default: "a default event description",
    },
    eventDateTime: {
      type: Date,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    activities: [
      { type: mongoose.Schema.Types.ObjectId, ref: "EventActivity" },
    ],
    chosenActivity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventActivity",
    },
  },
  { timestamps: true }
);

// Middleware to add the newly created event's _id into groupEvents in the Group schema
eventSchema.pre("save", async function (next) {
  const foundGroup = await Group.findOne({ _id: this.groupID });

  foundGroup.groupEvents.push(this._id);

  await foundGroup.save();

  next();
});

module.exports = mongoose.model("Event", eventSchema);
