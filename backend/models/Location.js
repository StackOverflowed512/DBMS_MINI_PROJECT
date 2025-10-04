const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
    {
        locationName: {
            type: String,
            required: [true, "Please add location name"],
            trim: true,
            unique: true,
            maxlength: [
                100,
                "Location name cannot be more than 100 characters",
            ],
        },
        address: {
            street: {
                type: String,
                required: [true, "Please add street address"],
            },
            city: {
                type: String,
                required: [true, "Please add city"],
            },
            state: {
                type: String,
                required: [true, "Please add state"],
            },
            zipCode: {
                type: String,
                required: [true, "Please add zip code"],
            },
            country: {
                type: String,
                default: "United States",
            },
        },
        capacity: {
            type: Number,
            required: [true, "Please add capacity"],
            min: [1, "Capacity must be at least 1"],
        },
        contactNumber: {
            type: String,
            required: [true, "Please add contact number"],
            match: [
                /^[\+]?[1-9][\d]{0,15}$/,
                "Please add a valid contact number",
            ],
        },
        operatingHours: {
            open: {
                type: String,
                required: [true, "Please add opening time"],
            },
            close: {
                type: String,
                required: [true, "Please add closing time"],
            },
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
locationSchema.index({ locationName: "text" });
locationSchema.index({ "address.city": 1, "address.state": 1 });

module.exports = mongoose.model("Location", locationSchema);
