const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide an event name!"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
