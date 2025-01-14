const express = require("express");
const Attendee = require("../models/Attendee");

const router = express.Router();

// List all attendees
router.get("/", async (req, res) => {
  try {
    const attendees = await Attendee.find();
    res.render("attendees/index", { attendees });
  } catch (err) {
    res.status(500).render("error", { error: err.message });
  }
});

// Show attendee creation form
router.get("/new", (req, res) => {
  res.render("attendees/new");
});

// Create new attendee
router.post("/", async (req, res) => {
  try {
    await Attendee.create(req.body);
    res.redirect("/attendees");
  } catch (err) {
    res.status(400).render("error", { error: err.message });
  }
});

// Show edit form
router.get("/:id/edit", async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id);
    if (!attendee) throw new Error("Attendee not found");
    res.render("attendees/edit", { attendee });
  } catch (err) {
    res.status(404).render("error", { error: err.message });
  }
});

// Update attendee
router.put("/:id", async (req, res) => {
  try {
    await Attendee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect("/attendees");
  } catch (err) {
    res.status(400).render("error", { error: err.message });
  }
});

// Delete attendee
router.delete("/:id", async (req, res) => {
  try {
    await Attendee.findByIdAndDelete(req.params.id);
    res.redirect("/attendees");
  } catch (err) {
    res.status(500).render("error", { error: err.message });
  }
});

module.exports = router;
