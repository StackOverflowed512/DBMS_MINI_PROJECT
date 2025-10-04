const db = require("../config/db");

const getAllVaccines = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM Vaccine");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createVaccine = async (req, res) => {
    const { Vaccine_Name, Manufacturer, Description, Price } = req.body;
    if (!Vaccine_Name || !Manufacturer || Price === undefined) {
        return res
            .status(400)
            .json({
                message: "Vaccine name, manufacturer, and price are required",
            });
    }
    try {
        const [result] = await db.execute(
            "INSERT INTO Vaccine (Vaccine_Name, Manufacturer, Description, Price) VALUES (?, ?, ?, ?)",
            [Vaccine_Name, Manufacturer, Description || "", Price]
        );
        res.status(201).json({ Vaccine_id: result.insertId, ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateVaccine = async (req, res) => {
    const { id } = req.params;
    const { Vaccine_Name, Manufacturer, Description, Price } = req.body;
    if (!Vaccine_Name || !Manufacturer || Price === undefined) {
        return res
            .status(400)
            .json({
                message: "Vaccine name, manufacturer, and price are required",
            });
    }
    try {
        const [result] = await db.execute(
            "UPDATE Vaccine SET Vaccine_Name = ?, Manufacturer = ?, Description = ?, Price = ? WHERE Vaccine_id = ?",
            [Vaccine_Name, Manufacturer, Description || "", Price, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Vaccine not found" });
        }
        res.json({ Vaccine_id: parseInt(id), ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteVaccine = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute(
            "DELETE FROM Vaccine WHERE Vaccine_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Vaccine not found" });
        }
        res.json({ message: "Vaccine deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllVaccines,
    createVaccine,
    updateVaccine,
    deleteVaccine,
};
