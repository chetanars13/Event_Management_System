const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    organizers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendee",
      },
    ],
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendee",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
