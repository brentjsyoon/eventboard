const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const authenticateToken = require("../middleware/authenticateToken");
const { isValidEvent } = require("../validation");

router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (query.length > 100) return res.status(400).json({ error: "Search query is too long" });
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter = escapedQuery
      ? { $or: ["title", "description", "location"].map((field) => ({ [field]: { $regex: escapedQuery, $options: "i" } })) }
      : {};
    const [events, total] = await Promise.all([
      Event.find(filter).sort({ date: 1 }).skip((page - 1) * limit).limit(limit),
      Event.countDocuments(filter),
    ]);
    res.json({ events, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching events" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, date, location, description } = req.body;
    if (!isValidEvent({ title, date, location, description }) || !req.user.email) {
      return res.status(400).json({ error: "Provide a valid title, date, location, and description" });
    }
    const newEvent = new Event({
      title: title.trim(),
      date: new Date(date),
      location: location.trim(),
      description: description.trim(),
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