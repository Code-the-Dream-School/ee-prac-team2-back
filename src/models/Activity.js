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
        message: "Invalid category type!",
      },
      required: [true, "please provide a valid category!"],
    },
    votes: {
      type: Number,
      validate: {
        validator: Number.isInteger,
        message: "Vote must be an integer!",
      },
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
