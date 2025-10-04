const mongoose = require("mongoose");

const vaccineSessionSchema = new mongoose.Schema(
    {
        person: {
            type: mongoose.Schema.ObjectId,
            ref: "Person",
            required: [true, "Please select a person"],
        },
        vaccine: {
            type: mongoose.Schema.ObjectId,
            ref: "Vaccine",
            required: [true, "Please select a vaccine"],
        },
        location: {
            type: mongoose.Schema.ObjectId,
            ref: "Location",
            required: [true, "Please select a location"],
        },
        vaccinationDate: {
            type: Date,
            required: [true, "Please add vaccination date"],
        },
        vaccinationTime: {
            type: String,
            required: [true, "Please add vaccination time"],
        },
        doseNumber: {
            type: Number,
            required: [true, "Please add dose number"],
            min: [1, "Dose number must be at least 1"],
        },
        status: {
            type: String,
            enum: ["scheduled", "completed", "cancelled", "no-show"],
            default: "scheduled",
        },
        notes: {
            type: String,
            maxlength: [500, "Notes cannot be more than 500 characters"],
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent duplicate sessions
vaccineSessionSchema.index(
    {
        person: 1,
        vaccine: 1,
        doseNumber: 1,
    },
    {
        unique: true,
        partialFilterExpression: {
            status: { $in: ["scheduled", "completed"] },
        },
    }
);

// Index for better query performance
vaccineSessionSchema.index({ vaccinationDate: 1 });
vaccineSessionSchema.index({ person: 1 });
vaccineSessionSchema.index({ location: 1 });

// Virtual for populated data
vaccineSessionSchema.virtual("sessionDetails").get(function () {
    return {
        sessionId: this._id,
        vaccinationDate: this.vaccinationDate,
        vaccinationTime: this.vaccinationTime,
        doseNumber: this.doseNumber,
        status: this.status,
    };
});

module.exports = mongoose.model("VaccineSession", vaccineSessionSchema);
