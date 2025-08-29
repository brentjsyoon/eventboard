require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors()); // dev only
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

// Serve frontend
app.use(express.static(path.join(__dirname, '../eventboard-fe')));

// Public landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../eventboard-fe/index.html'));
});

// Dashboard page (unprotected)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../eventboard-fe/dashboard.html'));
});

// Protected API
app.get('/api/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Protected profile data', user: req.user });
});

app.listen(PORT, () => console.log(`Resource server running on port ${PORT}`));