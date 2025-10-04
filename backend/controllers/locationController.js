const db = require("../config/db");

const getAllLocations = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM Location");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createLocation = async (req, res) => {
    const { Location_Name, Address } = req.body;
    if (!Location_Name || !Address) {
        return res
            .status(400)
            .json({ message: "Location name and address are required" });
    }
    try {
        const [result] = await db.execute(
            "INSERT INTO Location (Location_Name, Address) VALUES (?, ?)",
            [Location_Name, Address]
        );
        res.status(201).json({ Location_id: result.insertId, ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateLocation = async (req, res) => {
    const { id } = req.params;
    const { Location_Name, Address } = req.body;
    if (!Location_Name || !Address) {
        return res
            .status(400)
            .json({ message: "Location name and address are required" });
    }
    try {
        const [result] = await db.execute(
            "UPDATE Location SET Location_Name = ?, Address = ? WHERE Location_id = ?",
            [Location_Name, Address, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Location not found" });
        }
        res.json({ Location_id: parseInt(id), ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteLocation = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute(
            "DELETE FROM Location WHERE Location_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Location not found" });
        }
        res.json({ message: "Location deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllLocations,
    createLocation,
    updateLocation,
    deleteLocation,
};
