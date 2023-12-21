const schedule = require("node-schedule");
const Event = require("../models/Event");
const EventActivity = require("../models/EventActivity");

// A variable number of minutes as the time span to determine the chosen activity
// Currently set for '1 minutes'. 1 minute before the
// specific Event's 'eventDateTime' the chosenActivity gets determined
const CHOOSE_ACTIVITY_BEFORE_MINUTES = 1;

const scheduleJobToSelectActivity = async function () {
  // The schedule job is set to run every minute
  schedule.scheduleJob("* * * * *", async () => {
    // Get all upcoming events within CHOOSE_ACTIVITY_BEFORE_MINUTES
    const upcomingEvents = await Event.find({
      eventDateTime: {
        $gt: Date.now(),
        $lt: new Date(Date.now() + CHOOSE_ACTIVITY_BEFORE_MINUTES * 60 * 1000),
      },
    });

    for (const event of upcomingEvents) {
      const activities = await EventActivity.find({ eventID: event._id });

      // Using mongoose aggregate to find the 'EventActivity' with highest number of votes
      const mostVotedActivity = await EventActivity.aggregate([
        // Find a matching 'EventActivity' by '_id' from the array of 'Event' activities
        // mapped to a new array to only consider their '_id[s]'
        { $match: { _id: { $in: activities.map((a) => a._id) } } },
        // Only take out the '_id' field based on the number of 'votes'
        { $project: { _id: 1, votes: { $size: "$votes" }, voters: "$votes" } },
        // Sort the array
        { $sort: { votes: -1 } },
        // Return only one with most votes
        { $limit: 1 },
      ]);

      // If there is an activity with most votes
      if (mostVotedActivity.length) {
        // Add the activity to 'chosenActivity' field
        // Add the voters of the activity to 'participants' field
        await Event.updateOne(
          { _id: event._id },
          {
            chosenActivity: mostVotedActivity[0]._id,
            participants: mostVotedActivity[0].voters,
          }
        );
      }
    }
  });
};

module.exports = { scheduleJobToSelectActivity };
