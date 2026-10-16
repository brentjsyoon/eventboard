require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const authenticateToken = require('./middleware/authenticateToken');
const eventRoutes = require('./routes/events');
const bookingRoutes =require('./routes/bookings');

const PORT = process.env.PORT || 3000;
const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const https = require("https");

https.get("https://checkip.amazonaws.com", (res) => {
  let ip = "";
  res.on("data", (chunk) => ip += chunk);
  res.on("end", () => console.log("🌐 ECS outbound IP:", ip.trim()));
}).on("error", (err) => {
  console.error("Outbound IP check failed:", err.message);
});

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