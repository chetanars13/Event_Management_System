const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Organizer", "Participant"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attendee", attendeeSchema);
