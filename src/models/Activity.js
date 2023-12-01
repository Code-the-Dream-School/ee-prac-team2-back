const Vote = require("./Vote");
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide an activity name!"],
      unique: true,
    },
    description: {
      type: String,
      default: "a default activity description",
    },
    category: {
      type: String,
      enum: {
        values: [
          "relaxing",
          "creative",
          "social",
          "educational",
          "holiday",
          "cultural",
        ],
        message:
          "Invalid category type! Choose from ['relaxing', 'creative', 'social', 'educational', 'holiday', 'cultural']",
      },
      required: [true, "please provide a valid category!"],
    },
    votes: { type: mongoose.Schema.Types.ObjectId, ref: "Vote" },
  },
  { timestamps: true }
);

// Middleware to create a vote set to 0 before an activity is saved
activitySchema.pre("save", async function (next) {
  const newVote = new Vote({ activity: this._id });
  await newVote.save();
  this.votes = newVote._id;
  next();
});

module.exports = mongoose.model("Activity", activitySchema);
