const express = require("express");
const { body, validationResult } = require("express-validator");
const Vaccine = require("../models/Vaccine");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all vaccines with search and pagination
// @route   GET /api/vaccines
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
                    { vaccineName: { $regex: search, $options: "i" } },
                    { manufacturer: { $regex: search, $options: "i" } },
                ],
            };
        }

        const vaccines = await Vaccine.find(query)
            .sort({ vaccineName: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Vaccine.countDocuments(query);

        res.json({
            success: true,
            data: vaccines,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get vaccines error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// @desc    Get single vaccine
// @route   GET /api/vaccines/:id
// @access  Private
router.get("/:id", async (req, res) => {
    try {
        const vaccine = await Vaccine.findById(req.params.id);

        if (!vaccine) {
            return res.status(404).json({
                success: false,
                message: "Vaccine not found",
            });
        }

        res.json({
            success: true,
            data: vaccine,
        });
    } catch (error) {
        console.error("Get vaccine error:", error);
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Vaccine not found",
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// @desc    Create vaccine
// @route   POST /api/vaccines
// @access  Private
router.post(
    "/",
    [
        body("vaccineName").notEmpty().withMessage("Vaccine name is required"),
        body("manufacturer").notEmpty().withMessage("Manufacturer is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("price")
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number"),
        body("dosesRequired")
            .isInt({ min: 1, max: 5 })
            .withMessage("Doses required must be between 1 and 5"),
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

            const vaccine = await Vaccine.create(req.body);

            res.status(201).json({
                success: true,
                data: vaccine,
            });
        } catch (error) {
            console.error("Create vaccine error:", error);
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: "Vaccine with this name already exists",
                });
            }
            res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
);

// @desc    Update vaccine
// @route   PUT /api/vaccines/:id
// @access  Private
router.put(
    "/:id",
    [
        body("vaccineName")
            .optional()
            .notEmpty()
            .withMessage("Vaccine name is required"),
        body("manufacturer")
            .optional()
            .notEmpty()
            .withMessage("Manufacturer is required"),
        body("description")
            .optional()
            .notEmpty()
            .withMessage("Description is required"),
        body("price")
            .optional()
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number"),
        body("dosesRequired")
            .optional()
            .isInt({ min: 1, max: 5 })
            .withMessage("Doses required must be between 1 and 5"),
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

            let vaccine = await Vaccine.findById(req.params.id);

            if (!vaccine) {
                return res.status(404).json({
                    success: false,
                    message: "Vaccine not found",
                });
            }

            vaccine = await Vaccine.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });

            res.json({
                success: true,
                data: vaccine,
            });
        } catch (error) {
            console.error("Update vaccine error:", error);
            if (error.name === "CastError") {
                return res.status(404).json({
                    success: false,
                    message: "Vaccine not found",
                });
            }
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: "Vaccine with this name already exists",
                });
            }
            res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
);

// @desc    Delete vaccine (soft delete)
// @route   DELETE /api/vaccines/:id
// @access  Private
router.delete("/:id", async (req, res) => {
    try {
        const vaccine = await Vaccine.findById(req.params.id);

        if (!vaccine) {
            return res.status(404).json({
                success: false,
                message: "Vaccine not found",
            });
        }

        // Soft delete by setting isActive to false
        vaccine.isActive = false;
        await vaccine.save();

        res.json({
            success: true,
            message: "Vaccine deleted successfully",
        });
    } catch (error) {
        console.error("Delete vaccine error:", error);
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Vaccine not found",
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

module.exports = router;
