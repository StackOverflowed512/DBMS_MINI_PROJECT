const db = require("../config/db");

const getAllPersons = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM Person");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createPerson = async (req, res) => {
    const { Full_Name, Email, Contact_Number, DOB, Gender, Address } = req.body;
    if (
        !Full_Name ||
        !Email ||
        !Contact_Number ||
        !DOB ||
        !Gender ||
        !Address
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const [result] = await db.execute(
            "INSERT INTO Person (Full_Name, Email, Contact_Number, DOB, Gender, Address) VALUES (?, ?, ?, ?, ?, ?)",
            [Full_Name, Email, Contact_Number, DOB, Gender, Address]
        );
        res.status(201).json({ Person_id: result.insertId, ...req.body });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(400).json({ message: err.message });
    }
};

const updatePerson = async (req, res) => {
    const { id } = req.params;
    const { Full_Name, Email, Contact_Number, DOB, Gender, Address } = req.body;
    if (
        !Full_Name ||
        !Email ||
        !Contact_Number ||
        !DOB ||
        !Gender ||
        !Address
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const [result] = await db.execute(
            "UPDATE Person SET Full_Name = ?, Email = ?, Contact_Number = ?, DOB = ?, Gender = ?, Address = ? WHERE Person_id = ?",
            [Full_Name, Email, Contact_Number, DOB, Gender, Address, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Person not found" });
        }
        res.json({ Person_id: parseInt(id), ...req.body });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(400).json({ message: err.message });
    }
};

const deletePerson = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute(
            "DELETE FROM Person WHERE Person_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Person not found" });
        }
        res.json({ message: "Person deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllPersons, createPerson, updatePerson, deletePerson };
