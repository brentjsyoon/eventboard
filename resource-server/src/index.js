require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const authenticateToken = require('./middleware/authenticateToken');
const eventRoutes = require('./routes/events');
const bookingRoutes =require('./routes/bookings');

const PORT = process.env.PORT || 3000;
const app = express();

connectDB();

// --- CORS Middleware ---
app.use(cors({
   origin: process.env.CLIENT_URL,        // must match your frontend exactly
  credentials: true,         // allow cookies / auth headers
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// --- Handle preflight OPTIONS requests ---
app.options("*", cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());


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