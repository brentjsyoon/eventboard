const express = require("express");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const authenticateToken = require("../middleware/authenticateToken");
const { isValidBooking } = require("../validation");

const router = express.Router();

// Create a booking
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { eventId, seats } = req.body;
        if (!isValidBooking({ eventId, seats })) {
            return res.status(400).json({ error: "Provide a valid event ID and a positive whole number of seats" });
        }
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ error: "Event not found" });
        const existingBooking = await Booking.findOne({ event: eventId, user: req.user.email });
        if (existingBooking) return res.status(409).json({ error: "You have already booked this event" });

        const booking = new Booking({
            event: eventId,
            user: req.user.email,
            seats: seats ?? 1,
        });
        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        if (err.code === 11000) return res.status(409).json({ error: "You have already booked this event" });
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