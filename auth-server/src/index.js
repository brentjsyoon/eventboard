require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { rateLimit } = require("express-rate-limit");
const crypto = require("crypto");
const connectDB = require("./db");
const User = require("./models/User");

const PORT = process.env.PORT || 4000;
const app = express();
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;
const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: REFRESH_TOKEN_TTL,
};

if (
  !process.env.MONGO_URI ||
  !process.env.ACCESS_TOKEN_SECRET ||
  !process.env.REFRESH_TOKEN_SECRET ||
  !process.env.CLIENT_URL
) {
  throw new Error("MONGO_URI, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, and CLIENT_URL must be configured");
}
if (process.env.ACCESS_TOKEN_SECRET === process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("Access and refresh token secrets must be different");
}

connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173"
].filter(Boolean);
app.set("trust proxy", 1);
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
app.use(cookieParser());

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
const tokenDigest = (token) => crypto.createHash("sha256").update(token).digest("hex");
const requireAllowedOrigin = (req, res, next) => {
  const origin = req.get("origin");
  if (origin && !allowedOrigins.includes(origin)) return res.sendStatus(403);
  next();
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
    jwtid: crypto.randomUUID(),
  });
}

app.post("/users", authRateLimit, async (req, res) => {
  try {
    const { fullName, email, password } = req.body || {};
    if (
      typeof fullName !== "string" || !fullName.trim() || fullName.trim().length > 120 ||
      typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof password !== "string" || password.length < 8 || Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({ error: "Provide a valid name, email, and password (8-72 bytes)" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(409).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName: fullName.trim(), email: normalizedEmail, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: "User already exists" });
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", authRateLimit, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid email or password" });

    const payload = { fullName: user.fullName, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshTokens = user.refreshTokens.filter((token) => /^[a-f\d]{64}$/i.test(token));
    user.refreshTokens.push(tokenDigest(refreshToken));
    await user.save();

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/token", requireAllowedOrigin, async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const oldDigest = tokenDigest(refreshToken);
    const user = await User.findOne({ refreshTokens: oldDigest });
    if (!user) {
      res.clearCookie("refreshToken", refreshCookieOptions);
      return res.sendStatus(403);
    }

    const userPayload = { fullName: payload.fullName, email: payload.email };
    const nextRefreshToken = generateRefreshToken(userPayload);
    const rotatedUser = await User.findOneAndUpdate(
      { _id: user._id, refreshTokens: oldDigest },
      { $set: { "refreshTokens.$": tokenDigest(nextRefreshToken) } },
      { new: true }
    );
    if (!rotatedUser) {
      res.clearCookie("refreshToken", refreshCookieOptions);
      return res.sendStatus(403);
    }

    res.cookie("refreshToken", nextRefreshToken, refreshCookieOptions);
    res.json({ accessToken: generateAccessToken(userPayload) });
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      res.clearCookie("refreshToken", refreshCookieOptions);
      return res.sendStatus(403);
    }
    console.error(err);
    res.sendStatus(500);
  }
});

app.delete("/logout", requireAllowedOrigin, async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshTokens: tokenDigest(refreshToken) },
        { $pull: { refreshTokens: tokenDigest(refreshToken) } }
      );
    }
    res.clearCookie("refreshToken", refreshCookieOptions);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => console.log(`Auth server running on port ${PORT}`));