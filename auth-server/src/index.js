require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const connectDB = require("./db");
const User = require("./models/User");

const PORT = process.env.PORT || 4000;
const app = express();

// Connect DB
connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173"
];
app.use(cors({
  origin: function (origin, callback) {
    console.log("Request Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      console.log("✅ Allowed by CORS:", origin);
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.use(express.json());

// --- Generate JWT ---
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

// --- Signup ---
app.post("/users", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, password: hashedPassword });

    await newUser.save();
    res.status(201).send("User created");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// --- Login ---
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Cannot find user");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(403).send("Incorrect password");

    const payload = { fullName: user.fullName, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

    user.refreshTokens.push(refreshToken);
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// --- Token Refresh ---
app.post("/token", async (req, res) => {
  const { token: refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  try {
    // find user that has this refresh token
    const user = await User.findOne({ refreshTokens: refreshToken });
    if (!user) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({ fullName: payload.fullName, email: payload.email });
      res.json({ accessToken });
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// --- Logout ---
app.delete("/logout", async (req, res) => {
  const { token: refreshToken } = req.body;

  try {
    const user = await User.findOne({ refreshTokens: refreshToken });
    if (!user) return res.sendStatus(204);

    // remove the refresh token
    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
    await user.save();

    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));