const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  user: String,
  seats: Number,
});

module.exports = mongoose.model("Booking", bookingSchema);