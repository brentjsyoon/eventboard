const express = require("express");
const Event = require("../models/Event");
const router = express.Router();

// GET all events (sorted by date)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
    try {
        const { title, date, location, description } = req.body;

        if (!title || !date || !location) {
            return res.status(400).json({ error: "Missing required fields" });
        }

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
        res.status(500).json({ error: "Failed to create event" });
    }
});

module.exports = router;