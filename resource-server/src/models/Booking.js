import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: String, required: true }, // can also store user ID/email
    seats: { type: Number, default: 1 }, // optional
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);