const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
    .connect(
        process.env.MONGODB_URI || "mongodb://localhost:27017/vaccine_tracker",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/persons", require("./routes/persons"));
app.use("/api/vaccines", require("./routes/vaccines"));
app.use("/api/locations", require("./routes/locations"));
app.use("/api/sessions", require("./routes/sessions"));

// Error handling middleware
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
