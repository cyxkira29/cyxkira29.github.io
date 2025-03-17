const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Get all items (excluding hidden items)
router.get("/", (req, res) => {
    const query = "SELECT * FROM tbl_item WHERE Is_Hidden = 0";

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Error fetching items:", err);
            return res.status(500).json({ error: "Error fetching items", details: err.message });
        }
        res.json(results);
    });
});

// ✅ Add a new item
router.post("/", (req, res) => {
    const { Pawnticket_ID, Item_Value, Description, Interest, Net_Value, category } = req.body;

    if (!Pawnticket_ID || !Item_Value || !Description || !Interest || !Net_Value || !category) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = `
        INSERT INTO tbl_item (Pawnticket_ID, Item_Value, Description, Interest, Net_Value, category, Is_Hidden) 
        VALUES (?, ?, ?, ?, ?, ?, 0)
    `;

    db.query(query, [Pawnticket_ID, Item_Value, Description, Interest, Net_Value, category], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error adding item", details: err.message });
        }
        res.json({ message: "Item added successfully", id: result.insertId });
    });
});

// ✅ Update an item
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { Pawnticket_ID, Item_Value, Description, Interest, Net_Value, category, Is_Hidden } = req.body;

    if (!Pawnticket_ID || !Item_Value || !Description || !Interest || !Net_Value || !category || Is_Hidden === undefined) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = `
        UPDATE tbl_item SET Pawnticket_ID = ?, Item_Value = ?, Description = ?, 
        Interest = ?, Net_Value = ?, category = ?, Is_Hidden = ? WHERE Item_ID = ?
    `;

    db.query(query, [Pawnticket_ID, Item_Value, Description, Interest, Net_Value, category, Is_Hidden, id], (err, result) => {
        if (err) {
            console.error("❌ Error updating item:", err);
            return res.status(500).json({ error: "Error updating item", details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Item not found." });
        }
        res.json({ status: "success", message: "Item updated successfully" });
    });
});

// ✅ Delete an item
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM tbl_item WHERE Item_ID = ?", [id], (err, result) => {
        if (err) {
            console.error("❌ Error deleting item:", err);
            return res.status(500).json({ error: "Error deleting item", details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Item not found." });
        }
        res.json({ status: "success", message: "Item deleted successfully" });
    });
});

// ✅ Export the router
module.exports = router;
