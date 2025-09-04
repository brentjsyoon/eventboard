const express = require("express");
const Booking = require("../models/Booking");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// Create a booking
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { eventId, seats } = req.body;
        const booking = new Booking({
            event: eventId,
            user: req.user.email,
            seats: seats || 1,
        });
        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating booking" });
    }
});

// Get all bookings for logged-in user
router.get("/", authenticateToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.email }).populate("event");
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching bookings" });
    }
});

module.exports = router;