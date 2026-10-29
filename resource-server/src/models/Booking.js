const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  user: { type: String, required: true },
  seats: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
});

bookingSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);