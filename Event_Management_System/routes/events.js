const express = require("express");
const Event = require("../models/Event");
const Task = require("../models/Task");
const Attendee = require("../models/Attendee");
const router = express.Router();

// List all events
// router.get("/", async (req, res) => {
//   try {
//     const events = await Event.find().populate("attendees");
//     res.render("events/index", { events, body: "Your body content here" });
//   } catch (err) {
//     res.status(500).render("error", { error: err.message });
//   }
// });
router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizers", "name email")
      .populate("attendees", "name email");
    res.render("events/index", { events });
  } catch (err) {
    res.status(500).render("error", { error: err.message });
  }
});
// Show event creation form
// router.get("/new", (req, res) => {
//   try {
//     res.render("events/new");
//   } catch (err) {
//     res.status(500);
//   }
// });
router.get("/new", async (req, res) => {
  try {
    const attendees = await Attendee.find(); // Fetch all attendees
    res.render("events/new", { attendees }); // Pass attendees to the view
  } catch (err) {
    res.status(500).render("error", { error: err.message });
  }
});
// Create new event
// router.post("/", async (req, res) => {
//   try {
//     await Event.create(req.body);
//     res.redirect("/events");
//   } catch (err) {
//     res.status(400).render("error", { error: err.message });
//   }
// });
router.post("/", async (req, res) => {
  try {
    const { name, description, location, date, organizers, attendees } =
      req.body;
    await Event.create({
      name,
      description,
      location,
      date,
      organizers: Array.isArray(organizers) ? organizers : [organizers],
      attendees: Array.isArray(attendees) ? attendees : [attendees],
    });
    res.redirect("/events");
  } catch (err) {
    res.status(400).render("error", { error: err.message });
  }
});
// Show event details
// router.get("/:id", async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id).populate("attendees");
//     const tasks = await Task.find({ eventId: req.params.id }).populate(
//       "assignedTo"
//     );
//     res.render("events/show", { event, tasks });
//   } catch (err) {
//     res.status(404).render("error", { error: "Event not found" });
//   }
// });
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizers", "name email")
      .populate("attendees", "name email");
    const tasks = await Task.find({ eventId: req.params.id }).populate(
      "assignedTo"
    );
    res.render("events/show", { event, tasks });
  } catch (err) {
    res.status(404).render("error", { error: "Event not found" });
  }
});

// Show edit form

// router.get("/:id/edit", async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     res.render("events/edit", { event });
//   } catch (err) {
//     res.status(404).render("error", { error: "Event not found" });
//   }
// });
router.get("/:id/edit", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizers") // Populate organizers with full attendee data
      .populate("attendees"); // Populate attendees with full attendee data
    const attendees = await Attendee.find(); // Fetch all attendees
    console.log("Event and Attendees Fetched Successfully", {
      event,
      attendees,
    });
    res.render("events/edit", { event, attendees }); // Pass event and attendees
  } catch (err) {
    console.error("Error in Event.js edit route:", err);
    res.status(404).render("error", { error: "Event not found" });
  }
});

// Update event
// router.put("/:id", async (req, res) => {
//   try {
//     await Event.findByIdAndUpdate(req.params.id, req.body);
//     res.redirect("/events");
//   } catch (err) {
//     res.status(400).render("error", { error: err.message });
//   }
// });
router.put("/:id", async (req, res) => {
  try {
    const { name, description, location, date, organizers, attendees } =
      req.body;
    await Event.findByIdAndUpdate(req.params.id, {
      name,
      description,
      location,
      date,
      organizers: Array.isArray(organizers) ? organizers : [organizers],
      attendees: Array.isArray(attendees) ? attendees : [attendees],
    });
    res.redirect("/events");
  } catch (err) {
    res.status(400).render("error", { error: err.message });
  }
});

// Delete event
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ eventId: req.params.id });
    res.redirect("/events");
  } catch (err) {
    res.status(500).render("error", { error: err.message });
  }
});

module.exports = router;
