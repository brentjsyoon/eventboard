require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const connectDB = require('./db');
const eventRoutes = require('./routes/events');

const PORT = process.env.PORT || 3000;
const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

// Middleware to protect APIs
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Public route
app.get("/", (req, res) => {
  res.send("Public endpoint — no token required");
});

app.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "This is protected data",
    user: req.user,
  });
});

app.use("/events", authenticateToken, eventRoutes);

app.listen(PORT, () => console.log(`Resource server running on port ${PORT}`));