const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post(
    "/register",
    [
        body("username").notEmpty().withMessage("Username is required"),
        body("email").isEmail().withMessage("Please include a valid email"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters"),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            const { username, email, password } = req.body;

            // Check if user exists
            const userExists = await User.findOne({
                $or: [{ email }, { username }],
            });

            if (userExists) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists",
                });
            }

            // Create user
            const user = await User.create({
                username,
                email,
                password,
            });

            if (user) {
                res.status(201).json({
                    success: true,
                    data: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        token: generateToken(user._id),
                    },
                });
            }
        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({
                success: false,
                message: "Server error during registration",
            });
        }
    }
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Please include a valid email"),
        body("password").exists().withMessage("Password is required"),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array(),
                });
            }

            const { email, password } = req.body;

            // Check for user
            const user = await User.findOne({ email }).select("+password");

            if (user && (await user.matchPassword(password))) {
                res.json({
                    success: true,
                    data: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        token: generateToken(user._id),
                    },
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({
                success: false,
                message: "Server error during login",
            });
        }
    }
);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

module.exports = router;
