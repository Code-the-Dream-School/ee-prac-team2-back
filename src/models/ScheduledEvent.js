const mongoose = require("mongoose");

const scheduledEventSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      unique: true,
    },
    eventDate: {
      type: Date,
    },
    currentDate: {
      type: Date,
      default: new Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScheduledEvent", scheduledEventSchema);