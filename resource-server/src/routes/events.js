const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const authenticateToken = require("../middleware/authenticateToken");

// Public GET all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching events" });
  }
});

// Protected POST create event
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, date, location, description } = req.body;
    const newEvent = new Event({
      title,
      date,
      location,
      description,
      createdBy: req.user.email,
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error creating event" });
  }
});

module.exports = router;