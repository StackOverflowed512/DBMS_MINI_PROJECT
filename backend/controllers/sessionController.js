const db = require("../config/db");

const getAllSessions = async (req, res) => {
    try {
        const [rows] = await db.execute(`
      SELECT s.Session_id, p.Full_Name, v.Vaccine_Name, l.Location_Name, s.Vaccination_Date, s.Vaccination_Time
      FROM Vaccine_Session s
      JOIN Person p ON s.Person_id = p.Person_id
      JOIN Vaccine v ON s.Vaccine_id = v.Vaccine_id
      JOIN Location l ON s.Location_id = l.Location_id
    `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createSession = async (req, res) => {
    const {
        Person_id,
        Vaccine_id,
        Location_id,
        Vaccination_Date,
        Vaccination_Time,
    } = req.body;
    if (
        !Person_id ||
        !Vaccine_id ||
        !Location_id ||
        !Vaccination_Date ||
        !Vaccination_Time
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const [result] = await db.execute(
            "INSERT INTO Vaccine_Session (Person_id, Vaccine_id, Location_id, Vaccination_Date, Vaccination_Time) VALUES (?, ?, ?, ?, ?)",
            [
                Person_id,
                Vaccine_id,
                Location_id,
                Vaccination_Date,
                Vaccination_Time,
            ]
        );
        res.status(201).json({ Session_id: result.insertId, ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateSession = async (req, res) => {
    const { id } = req.params;
    const {
        Person_id,
        Vaccine_id,
        Location_id,
        Vaccination_Date,
        Vaccination_Time,
    } = req.body;
    if (
        !Person_id ||
        !Vaccine_id ||
        !Location_id ||
        !Vaccination_Date ||
        !Vaccination_Time
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const [result] = await db.execute(
            "UPDATE Vaccine_Session SET Person_id = ?, Vaccine_id = ?, Location_id = ?, Vaccination_Date = ?, Vaccination_Time = ? WHERE Session_id = ?",
            [
                Person_id,
                Vaccine_id,
                Location_id,
                Vaccination_Date,
                Vaccination_Time,
                id,
            ]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Session not found" });
        }
        res.json({ Session_id: parseInt(id), ...req.body });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteSession = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute(
            "DELETE FROM Vaccine_Session WHERE Session_id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Session not found" });
        }
        res.json({ message: "Session deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllSessions,
    createSession,
    updateSession,
    deleteSession,
};
