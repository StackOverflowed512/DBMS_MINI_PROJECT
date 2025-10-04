const express = require("express");
const { body, validationResult } = require("express-validator");
const Location = require("../models/Location");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all locations with search and pagination
// @route   GET /api/locations
// @access  Private
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        let query = { isActive: true };
        if (search) {
            query = {
                ...query,
                $or: [
                    { locationName: { $regex: search, $options: "i" } },
                    { "address.city": { $regex: search, $options: "i" } },
                    { "address.state": { $regex: search, $options: "i" } },
                ],
            };
        }

        const locations = await Location.find(query)
            .sort({ locationName: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Location.countDocuments(query);

        res.json({
            success: true,
            data: locations,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get locations error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Private
router.get("/:id", async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);

        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found",
            });
        }

        res.json({
            success: true,
            data: location,
        });
    } catch (error) {
        console.error("Get location error:", error);
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Location not found",
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// @desc    Create location
// @route   POST /api/locations
// @access  Private
router.post(
    "/",
    [
        body("locationName")
            .notEmpty()
            .withMessage("Location name is required"),
        body("address.street")
            .notEmpty()
            .withMessage("Street address is required"),
        body("address.city").notEmpty().withMessage("City is required"),
        body("address.state").notEmpty().withMessage("State is required"),
        body("address.zipCode").notEmpty().withMessage("Zip code is required"),
        body("capacity")
            .isInt({ min: 1 })
            .withMessage("Capacity must be at least 1"),
        body("contactNumber")
            .notEmpty()
            .withMessage("Contact number is required"),
        body("operatingHours.open")
            .notEmpty()
            .withMessage("Opening time is required"),
        body("operatingHours.close")
            .notEmpty()
            .withMessage("Closing time is required"),
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

            const location = await Location.create(req.body);

            res.status(201).json({
                success: true,
                data: location,
            });
        } catch (error) {
            console.error("Create location error:", error);
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: "Location with this name already exists",
                });
            }
            res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
);

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Private
router.put(
    "/:id",
    [
        body("locationName")
            .optional()
            .notEmpty()
            .withMessage("Location name is required"),
        body("capacity")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Capacity must be at least 1"),
        body("contactNumber")
            .optional()
            .notEmpty()
            .withMessage("Contact number is required"),
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

            let location = await Location.findById(req.params.id);

            if (!location) {
                return res.status(404).json({
                    success: false,
                    message: "Location not found",
                });
            }

            location = await Location.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            res.json({
                success: true,
                data: location,
            });
        } catch (error) {
            console.error("Update location error:", error);
            if (error.name === "CastError") {
                return res.status(404).json({
                    success: false,
                    message: "Location not found",
                });
            }
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: "Location with this name already exists",
                });
            }
            res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
);

// @desc    Delete location (soft delete)
// @route   DELETE /api/locations/:id
// @access  Private
router.delete("/:id", async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);

        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found",
            });
        }

        // Soft delete by setting isActive to false
        location.isActive = false;
        await location.save();

        res.json({
            success: true,
            message: "Location deleted successfully",
        });
    } catch (error) {
        console.error("Delete location error:", error);
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Location not found",
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

module.exports = router;
