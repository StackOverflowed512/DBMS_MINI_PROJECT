const mongoose = require("mongoose");

const personSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Please add full name"],
            trim: true,
            maxlength: [100, "Name cannot be more than 100 characters"],
        },
        email: {
            type: String,
            required: [true, "Please add an email"],
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please add a valid email",
            ],
        },
        contactNumber: {
            type: String,
            required: [true, "Please add contact number"],
            match: [
                /^[\+]?[1-9][\d]{0,15}$/,
                "Please add a valid contact number",
            ],
        },
        dob: {
            type: Date,
            required: [true, "Please add date of birth"],
        },
        gender: {
            type: String,
            required: [true, "Please select gender"],
            enum: ["Male", "Female", "Other"],
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
    },
    {
        timestamps: true,
    }
);

// Index for better search performance
personSchema.index({ email: 1 });
personSchema.index({ fullName: "text" });

module.exports = mongoose.model("Person", personSchema);
