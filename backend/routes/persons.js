const express = require("express");
const { body, validationResult } = require("express-validator");
const Person = require("../models/Person");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all persons with search and pagination
// @route   GET /api/persons
// @access  Private
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
            query = {
                $or: [
                    { fullName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            };
        }

        const persons = await Person.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Person.countDocuments(query);

        res.json({
            success: true,
            data: persons,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Get persons error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// @desc    Get single person
// @route   GET /api/persons/:id
// @access  Private
router.get("/:id", async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);

        if (!person) {
            return res.status(404).json({
                success: false,
                message: "Person not found",
            });
        }

        res.json({
            success: true,
            data: person,
        });
    } catch (error) {
        console.error("Get person error:", error);
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Person not found",
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

// @desc    Create person
// @route   POST /api/persons
// @access  Private
router.post(
    "/",
    [
        body("fullName").notEmpty().withMessage("Full name is required"),
        body("email").isEmail().withMessage("Please include a valid email"),
        body("contactNumber")
            .notEmpty()
            .withMessage("Contact number is required"),
        body("dob")
            .isDate()
            .withMessage("Please include a valid date of birth"),
        body("gender")
            .isIn(["Male", "Female", "Other"])
            .withMessage("Please select a valid gender"),
        body("address.street")
            .notEmpty()
            .withMessage("Street address is required"),
        body("address.city").notEmpty().withMessage("City is required"),
        body("address.state").notEmpty().withMessage("State is required"),
        body("address.zipCode").notEmpty().withMessage("Zip code is required"),
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

            const person = await Person.create(req.body);

            res.status(201).json({
                success: true,
                data: person,
            });
        } catch (error) {
            console.error("Create person error:", error);
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: "Person with this email already exists",
                });
            }
            res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
);

// @desc    Update person
// @route   PUT /api/persons/:id
// @access  Private
router.put(
    "/:id",
    [
        body("fullName")
            .optional()
            .notEmpty()
            .withMessage("Full name is required"),
        body("email")
            .optional()
            .isEmail()
            .withMessage("Please include a valid email"),
        body("contactNumber")
            .optional()
            .notEmpty()
            .withMessage("Contact number is required"),
        body("dob")
            .optional()
            .isDate()
            .withMessage("Please include a valid date of birth"),
        body("gender")
            .optional()
            .isIn(["Male", "Female", "Other"])
            .withMessage("Please select a valid gender"),
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

            let person = await Person.findById(req.params.id);

            if (!person) {
                return res.status(404).json({
                    success: false,
                    message: "Person not found",
                });
            }

            person = await Person.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });

            res.json({
                success: true,
                data: person,
            });
        } catch (error) {
            console.error("Update person error:", error);
            if (error.name === "CastError") {
                return res.status(404).json({
                    success: false,
                    message: "Person not found",
                });
            }
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: "Person with this email already exists",
                });
            }
            res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    }
);

// @desc    Delete person
// @route   DELETE /api/persons/:id
// @access  Private
router.delete("/:id", async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);

        if (!person) {
            return res.status(404).json({
                success: false,
                message: "Person not found",
            });
        }

        await Person.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Person deleted successfully",
        });
    } catch (error) {
        console.error("Delete person error:", error);
        if (error.name === "CastError") {
            return res.status(404).json({
                success: false,
                message: "Person not found",
            });
        }
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

module.exports = router;
