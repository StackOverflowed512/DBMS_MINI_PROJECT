const mongoose = require("mongoose");

const vaccineSchema = new mongoose.Schema(
    {
        vaccineName: {
            type: String,
            required: [true, "Please add vaccine name"],
            trim: true,
            unique: true,
            maxlength: [100, "Vaccine name cannot be more than 100 characters"],
        },
        manufacturer: {
            type: String,
            required: [true, "Please add manufacturer name"],
            trim: true,
            maxlength: [100, "Manufacturer cannot be more than 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Please add description"],
            maxlength: [500, "Description cannot be more than 500 characters"],
        },
        price: {
            type: Number,
            required: [true, "Please add price"],
            min: [0, "Price cannot be negative"],
        },
        dosesRequired: {
            type: Number,
            required: [true, "Please add number of doses required"],
            min: [1, "At least one dose is required"],
            max: [5, "Maximum 5 doses allowed"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for better search performance
vaccineSchema.index({ vaccineName: "text", manufacturer: "text" });

module.exports = mongoose.model("Vaccine", vaccineSchema);
