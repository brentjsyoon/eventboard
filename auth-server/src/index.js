require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000'
}));
app.use(express.json());

// In-memory storage (for demo)
const users = [];
let refreshTokens = [];

// --- Generate JWT ---
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

// --- Signup ---
app.post('/users', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (users.find(u => u.email === email)) return res.status(400).send('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { fullName, email, password: hashedPassword };
    users.push(user);
    res.status(201).send('User created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// --- Login ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).send('Cannot find user');

  try {
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = generateAccessToken({ fullName: user.fullName, email: user.email });
      const refreshToken = jwt.sign({ fullName: user.fullName, email: user.email }, process.env.REFRESH_TOKEN_SECRET);
      refreshTokens.push(refreshToken);
      res.json({ accessToken, refreshToken });
    } else {
      res.status(403).send('Incorrect password');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// --- Token Refresh ---
app.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ fullName: user.fullName, email: user.email });
    res.json({ accessToken });
  });
});

// --- Logout ---
app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(t => t !== req.body.token);
  res.sendStatus(204);
});

app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));