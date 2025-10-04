const express = require("express");
const { body, validationResult } = require("express-validator");
const VaccineSession = require("../models/VaccineSession");
const Person = require("../models/Person");
const Vaccine = require("../models/Vaccine");
const Location = require("../models/Location");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all sessions with populated data and filters
// @route   GET /api/sessions
// @access  Private
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { person, vaccine, location, status, date } = req.query;

        let query = {};
        if (person) query.person = person;
        if (vaccine) query.vaccine = vaccine;
        if (location) query.location = location;
        if (status) query.status = status;
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.vaccinationDate = { $gte: startDate, $lt: endDate };
        }

        const sessions = await VaccineSession.find(query)
            .populate("person", "fullName email contactNumber")
            .populate("vaccine", "vaccineName manufacturer price")
            .populate("location", "locationName address")
            .sort({ vaccinationDate: -1, vaccinationTime: 1 })
            .skip(skip)
            .limit(limit);

        const total = await VaccineSession.countDocuments(query);

        res.json({
            success: true,
            data: sessions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get sessions error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Private
router.get("/:id", async (req, res) => {
    try {
        const session = await VaccineSession.findById(req.params.id)
            .populate("person")
            .populate("vaccine")
            .populate("location");

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        res.json({
            success: true,
            data: session,
        });
    } catch (error) {
        console.error("Get session error:", error);
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// @desc    Create session
// @route   POST /api/sessions
// @access  Private
router.post(
    "/",
    [
        body("person").isMongoId().withMessage("Valid person ID is required"),
        body("vaccine").isMongoId().withMessage("Valid vaccine ID is required"),
        body("location")
            .isMongoId()
            .withMessage("Valid location ID is required"),
        body("vaccinationDate")
            .isDate()
            .withMessage("Valid vaccination date is required"),
        body("vaccinationTime")
            .notEmpty()
            .withMessage("Vaccination time is required"),
        body("doseNumber")
            .isInt({ min: 1 })
            .withMessage("Dose number must be at least 1"),
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

            // Check if person, vaccine, and location exist
            const [person, vaccine, location] = await Promise.all([
                Person.findById(req.body.person),
                Vaccine.findById(req.body.vaccine),
                Location.findById(req.body.location),
            ]);

            if (!person) {
                return res.status(404).json({
                    success: false,
                    message: "Person not found",
                });
            }
            if (!vaccine) {
                return res.status(404).json({
                    success: false,
                    message: "Vaccine not found",
                });
            }
            if (!location) {
                return res.status(404).json({
                    success: false,
                    message: "Location not found",
                });
            }

            // Check if dose number exceeds vaccine's required doses
            if (req.body.doseNumber > vaccine.dosesRequired) {
                return res.status(400).json({
                    success: false,
                    message: `Dose number cannot exceed ${vaccine.dosesRequired} for this vaccine`,
                });
            }

            const session = await VaccineSession.create(req.body);

            // Populate the created session
            const populatedSession = await VaccineSession.findById(session._id)
                .populate("person", "fullName email contactNumber")
                .populate("vaccine", "vaccineName manufacturer price")
                .populate("location", "locationName address");

            res.status(201).json({
                success: true,
                data: populatedSession,
            });
        } catch (error) {
            console.error("Create session error:", error);
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Duplicate session: This person already has this dose scheduled or completed",
                });
            }
            res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
);

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private
router.put(
    "/:id",
    [
        body("person")
            .optional()
            .isMongoId()
            .withMessage("Valid person ID is required"),
        body("vaccine")
            .optional()
            .isMongoId()
            .withMessage("Valid vaccine ID is required"),
        body("location")
            .optional()
            .isMongoId()
            .withMessage("Valid location ID is required"),
        body("vaccinationDate")
            .optional()
            .isDate()
            .withMessage("Valid vaccination date is required"),
        body("doseNumber")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Dose number must be at least 1"),
        body("status")
            .optional()
            .isIn(["scheduled", "completed", "cancelled", "no-show"])
            .withMessage("Invalid status"),
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

            let session = await VaccineSession.findById(req.params.id);

            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: "Session not found",
                });
            }

            // If vaccine is being updated, check dose number
            if (req.body.vaccine || req.body.doseNumber) {
                const vaccineId = req.body.vaccine || session.vaccine;
                const doseNumber = req.body.doseNumber || session.doseNumber;

                const vaccine = await Vaccine.findById(vaccineId);
                if (doseNumber > vaccine.dosesRequired) {
                    return res.status(400).json({
                        success: false,
                        message: `Dose number cannot exceed ${vaccine.dosesRequired} for this vaccine`,
                    });
                }
            }

            session = await VaccineSession.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            )
                .populate("person", "fullName email contactNumber")
                .populate("vaccine", "vaccineName manufacturer price")
                .populate("location", "locationName address");

            res.json({
                success: true,
                data: session,
            });
        } catch (error) {
            console.error("Update session error:", error);
            if (error.name === "CastError") {
                return res.status(404).json({
                    success: false,
                    message: "Session not found",
                });
            }
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Duplicate session: This person already has this dose scheduled or completed",
                });
            }
            res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
);

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private
router.delete("/:id", async (req, res) => {
    try {
        const session = await VaccineSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        await VaccineSession.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Session deleted successfully",
        });
    } catch (error) {
        console.error("Delete session error:", error);
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

module.exports = router;
