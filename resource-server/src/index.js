require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
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

app.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "This is protected data",
    user: req.user, // decoded JWT payload from auth server
  });
});

// Example public route
app.get("/", (req, res) => {
  res.send("Public endpoint — no token required");
});

app.listen(PORT, () => console.log(`Resource server running on port ${PORT}`));