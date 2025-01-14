const express = require("express");
const Task = require("../models/Task");
const Event = require("../models/Event");
const Attendee = require("../models/Attendee");

const router = express.Router();

// List all tasks
// List all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("eventId").populate("assignedTo");
    console.log(tasks);
    res.render("tasks/index", { tasks }); // Pass tasks to the EJS template
  } catch (err) {
    res
      .status(500)
      .render("error", { message: "Failed to fetch tasks", error: err });
  }
});

// Show task creation form
// router.get("/new", async (req, res) => {
//   try {
//     const events = await Event.find();
//     const attendees = await Attendee.find();
//     res.render("tasks/new", { events, attendees });
//   } catch (err) {
//     res.status(500);
//   }
// });
// Show task creation form
router.get("/new", async (req, res) => {
  try {
    const events = await Event.find();
    const attendees = await Attendee.find();

    // Send empty formData and errorMessage initially
    res.render("tasks/new", {
      events,
      attendees,
      errorMessage: undefined,
      formData: {},
    });
  } catch (err) {
    res
      .status(500)
      .render("error", {
        message: "Failed to load task creation form",
        error: err,
      });
  }
});

// Create new task
// router.post("/", async (req, res) => {
//   try {
//     await Task.create(req.body);
//     res.render("tasks/edit", { task, events, attendees });
//   } catch (err) {
//     res.status(400).render("error", { error: err.message });
//   }
// });
// Create new task with participant can't get assigned to organise the event
router.post("/", async (req, res) => {
  try {
    const { name, eventId, assignedTo, deadline, status } = req.body;

    // Validate if assignedTo is an organizer
    const attendee = await Attendee.findById(assignedTo);
    if (attendee.role !== "Organizer") {
      // Fetch events and attendees again to re-render the form with an error
      const events = await Event.find();
      const attendees = await Attendee.find();
      return res.status(400).render("tasks/new", {
        events,
        attendees,
        errorMessage: "Only organizers can be assigned to tasks.",
        formData: req.body, // Pass the submitted form data for convenience
      });
    }

    // If validation passes, create the task
    await Task.create({ name, eventId, assignedTo, deadline, status });
    res.redirect("/tasks");
  } catch (err) {
    res.status(500).render("error", { error: err.message });
  }
});

// Edit Task Route
router.get("/:id/edit", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("eventId")
      .populate("assignedTo");
    const events = await Event.find();
    const attendees = await Attendee.find();
    res.render("tasks/edit", { task, events, attendees });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Update task
// router.put("/:id", async (req, res) => {
//   try {
//     await Task.findByIdAndUpdate(req.params.id, req.body);
//     res.redirect("/tasks");
//   } catch (err) {
//     res.status(400).render("error", { error: err.message });
//   }
// });

router.put("/:id", async (req, res) => {
  try {
    const { name, eventId, assignedTo, deadline, status } = req.body;

    // Validate if assignedTo is an organizer
    const attendee = await Attendee.findById(assignedTo);
    if (attendee.role !== "Organizer") {
      // Render the edit page with an error message
      const task = await Task.findById(req.params.id)
        .populate("eventId")
        .populate("assignedTo");
      const events = await Event.find();
      const attendees = await Attendee.find();
      return res.status(400).render("tasks/edit", {
        task,
        events,
        attendees,
        errorMessage: "Only organizers can be assigned to tasks.",
      });
    }

    // If validation passes, update the task
    await Task.findByIdAndUpdate(req.params.id, {
      name,
      eventId,
      assignedTo,
      deadline,
      status,
    });
    res.redirect("/tasks");
  } catch (err) {
    res.status(500).render("error", { error: err.message });
  }
});

// Update task status
router.put("/:id/status", async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.redirect("/tasks");
  } catch (err) {
    res.status(400).render("error", { error: err.message });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect("/tasks");
  } catch (err) {
    res.status(500).render("error", { error: err.message });
  }
});

module.exports = router;
