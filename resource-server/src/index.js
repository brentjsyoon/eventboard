require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { rateLimit } = require("express-rate-limit");
const connectDB = require('./db');
const authenticateToken = require('./middleware/authenticateToken');
const eventRoutes = require('./routes/events');
const bookingRoutes =require('./routes/bookings');

const PORT = process.env.PORT || 3000;
const app = express();
app.set("trust proxy", 1);
if (!process.env.MONGO_URI || !process.env.ACCESS_TOKEN_SECRET || !process.env.CLIENT_URL) {
  throw new Error("MONGO_URI, ACCESS_TOKEN_SECRET, and CLIENT_URL must be configured");
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/ready", (req, res) => {
  if (require("mongoose").connection.readyState !== 1) {
    return res.status(503).json({ status: "not ready" });
  }
  res.status(200).json({ status: "ready" });
});

connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173"
].filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json({ limit: "10kb" }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
}));


// Public route
app.get("/", (req, res) => {
  res.send("Public endpoint — no token required");
});

// Protected profile route
app.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "This is protected data",
    user: req.user,
  });
});

app.use("/events", eventRoutes);

app.use("/bookings", bookingRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => console.log(`Resource server running on port ${PORT}`));