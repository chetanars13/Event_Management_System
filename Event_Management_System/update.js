const mongoose = require("mongoose");
const Event = require("./models/Event");
const Attendee = require("./models/Attendee");
require("dotenv").config();

async function updateEvent(eventName, organizerName, attendeeName) {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/event-management"
    );
    console.log("Connected to MongoDB");

    // Find the event
    const event = await Event.findOne({ name: eventName });
    if (!event) {
      console.error(`Event "${eventName}" not found`);
      return;
    }

    // Find the organizer
    const organizer = await Attendee.findOne({ name: organizerName });
    if (!organizer) {
      console.error(`Organizer "${organizerName}" not found`);
      return;
    }

    if (organizer.role !== "Organizer") {
      console.error(
        `"${organizerName}" is not an Organizer and cannot be added as one.`
      );
      return;
    }

    // Find the attendee
    const attendee = await Attendee.findOne({ name: attendeeName });
    if (!attendee) {
      console.error(`Attendee "${attendeeName}" not found`);
      return;
    }

    if (attendee.role !== "Participant") {
      console.error(
        `"${attendeeName}" is not a Participant and cannot be added as one.`
      );
      return;
    }

    // Update event
    if (!event.organizers.includes(organizer._id)) {
      event.organizers.push(organizer._id);
      console.log(`Added organizer "${organizerName}" to event "${eventName}"`);
    } else {
      console.log(
        `Organizer "${organizerName}" is already in the event "${eventName}"`
      );
    }

    if (!event.attendees.includes(attendee._id)) {
      event.attendees.push(attendee._id);
      console.log(`Added attendee "${attendeeName}" to event "${eventName}"`);
    } else {
      console.log(
        `Attendee "${attendeeName}" is already in the event "${eventName}"`
      );
    }

    await event.save();
    console.log(`Event "${eventName}" updated successfully`);
  } catch (error) {
    console.error("Error updating event:", error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Command-line arguments
const [eventName, organizerName, attendeeName] = process.argv.slice(2);

if (!eventName || !organizerName || !attendeeName) {
  console.error(
    "Usage: node updateEvent.js <eventName> <organizerName> <attendeeName>"
  );
  process.exit(1);
}

// Call the function
updateEvent(eventName, organizerName, attendeeName);
