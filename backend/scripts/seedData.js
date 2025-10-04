const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import models
const User = require("../models/User");
const Person = require("../models/Person");
const Vaccine = require("../models/Vaccine");
const Location = require("../models/Location");
const VaccineSession = require("../models/VaccineSession");

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(
            process.env.MONGODB_URI ||
                "mongodb://localhost:27017/vaccine_tracker"
        );
        console.log("Connected to MongoDB");

        // Clear existing data
        await User.deleteMany({});
        await Person.deleteMany({});
        await Vaccine.deleteMany({});
        await Location.deleteMany({});
        await VaccineSession.deleteMany({});
        console.log("Cleared existing data");

        // Create admin user
        const adminUser = await User.create({
            username: "admin",
            email: "admin@vaccinetracker.com",
            password: "admin123",
            role: "admin",
        });
        console.log("Admin user created");

        // Create sample persons
        const persons = await Person.create([
            {
                fullName: "John Smith",
                email: "john.smith@email.com",
                contactNumber: "+1234567890",
                dob: new Date("1985-05-15"),
                gender: "Male",
                address: {
                    street: "123 Main St",
                    city: "New York",
                    state: "NY",
                    zipCode: "10001",
                    country: "United States",
                },
            },
            {
                fullName: "Jane Doe",
                email: "jane.doe@email.com",
                contactNumber: "+1234567891",
                dob: new Date("1990-08-22"),
                gender: "Female",
                address: {
                    street: "456 Oak Ave",
                    city: "Los Angeles",
                    state: "CA",
                    zipCode: "90210",
                    country: "United States",
                },
            },
            {
                fullName: "Michael Johnson",
                email: "michael.j@email.com",
                contactNumber: "+1234567892",
                dob: new Date("1978-12-10"),
                gender: "Male",
                address: {
                    street: "789 Pine Rd",
                    city: "Chicago",
                    state: "IL",
                    zipCode: "60601",
                    country: "United States",
                },
            },
        ]);
        console.log("Sample persons created");

        // Create sample vaccines
        const vaccines = await Vaccine.create([
            {
                vaccineName: "COVID-19 Vaccine",
                manufacturer: "Pfizer-BioNTech",
                description:
                    "mRNA vaccine for COVID-19 prevention, requires 2 doses",
                price: 19.99,
                dosesRequired: 2,
            },
            {
                vaccineName: "Influenza Vaccine",
                manufacturer: "Sanofi Pasteur",
                description: "Seasonal flu vaccine, updated annually",
                price: 25.5,
                dosesRequired: 1,
            },
            {
                vaccineName: "MMR Vaccine",
                manufacturer: "Merck",
                description: "Measles, Mumps, and Rubella combination vaccine",
                price: 45.0,
                dosesRequired: 2,
            },
            {
                vaccineName: "HPV Vaccine",
                manufacturer: "Merck",
                description: "Human Papillomavirus vaccine, 3-dose series",
                price: 234.0,
                dosesRequired: 3,
            },
        ]);
        console.log("Sample vaccines created");

        // Create sample locations
        const locations = await Location.create([
            {
                locationName: "City Health Center",
                address: {
                    street: "123 Health St",
                    city: "New York",
                    state: "NY",
                    zipCode: "10002",
                    country: "United States",
                },
                capacity: 50,
                contactNumber: "+1234567800",
                operatingHours: {
                    open: "08:00",
                    close: "17:00",
                },
            },
            {
                locationName: "Community Hospital",
                address: {
                    street: "456 Medical Blvd",
                    city: "Los Angeles",
                    state: "CA",
                    zipCode: "90211",
                    country: "United States",
                },
                capacity: 100,
                contactNumber: "+1234567801",
                operatingHours: {
                    open: "07:00",
                    close: "19:00",
                },
            },
            {
                locationName: "Public Health Clinic",
                address: {
                    street: "789 Wellness Ave",
                    city: "Chicago",
                    state: "IL",
                    zipCode: "60602",
                    country: "United States",
                },
                capacity: 30,
                contactNumber: "+1234567802",
                operatingHours: {
                    open: "09:00",
                    close: "16:00",
                },
            },
        ]);
        console.log("Sample locations created");

        // Create sample sessions
        await VaccineSession.create([
            {
                person: persons[0]._id,
                vaccine: vaccines[0]._id,
                location: locations[0]._id,
                vaccinationDate: new Date("2023-10-15"),
                vaccinationTime: "10:00",
                doseNumber: 1,
                status: "completed",
            },
            {
                person: persons[0]._id,
                vaccine: vaccines[0]._id,
                location: locations[0]._id,
                vaccinationDate: new Date("2023-11-15"),
                vaccinationTime: "10:00",
                doseNumber: 2,
                status: "scheduled",
            },
            {
                person: persons[1]._id,
                vaccine: vaccines[1]._id,
                location: locations[1]._id,
                vaccinationDate: new Date("2023-10-20"),
                vaccinationTime: "14:30",
                doseNumber: 1,
                status: "completed",
            },
            {
                person: persons[2]._id,
                vaccine: vaccines[2]._id,
                location: locations[2]._id,
                vaccinationDate: new Date("2023-10-25"),
                vaccinationTime: "11:15",
                doseNumber: 1,
                status: "scheduled",
            },
        ]);
        console.log("Sample sessions created");

        console.log("✅ Database seeded successfully!");
        console.log("Admin login: admin@vaccinetracker.com / admin123");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await mongoose.connection.close();
    }
};

seedData();
