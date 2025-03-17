const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Get all pawned items with related details
router.get("/", (req, res) => {
    const query = `
        SELECT i.Item_ID, i.Pawnticket_ID, i.Item_Value, i.Description, 
               i.Interest, i.Net_Value, i.category, i.Is_Hidden,
               p.Customer_ID, p.Principal_Value, p.Maturity_Date, p.Expiry_Date,
               r.Redeemed_ID, r.Redeemed_Value, r.Redeemed_Date,
               rn.Renew_ID, rn.New_Principal_Value, rn.Maturity_Date AS Renewed_Maturity_Date, rn.Expiration_Date AS Renewed_Expiry_Date, rn.Penalty
        FROM tbl_item i
        LEFT JOIN tbl_pawnticket p ON i.Pawnticket_ID = p.Pawnticket_ID
        LEFT JOIN tbl_redeemed_items r ON i.Pawnticket_ID = r.Pawnticket_ID
        LEFT JOIN tbl_renew rn ON i.Pawnticket_ID = rn.Payment_ID
        WHERE i.Is_Hidden = 0;
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching pawned items", details: err.message });
        }
        res.json(results);
    });
});

// ✅ Get a single pawned item by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT i.*, 
               p.Customer_ID, p.Principal_Value, p.Maturity_Date, p.Expiry_Date,
               r.Redeemed_ID, r.Redeemed_Value, r.Redeemed_Date,
               rn.Renew_ID, rn.New_Principal_Value, rn.Maturity_Date AS Renewed_Maturity_Date, rn.Expiration_Date AS Renewed_Expiry_Date, rn.Penalty
        FROM tbl_item i
        LEFT JOIN tbl_pawnticket p ON i.Pawnticket_ID = p.Pawnticket_ID
        LEFT JOIN tbl_redeemed_items r ON i.Pawnticket_ID = r.Pawnticket_ID
        LEFT JOIN tbl_renew rn ON i.Pawnticket_ID = rn.Payment_ID
        WHERE i.Item_ID = ?;
    `;

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching item", details: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Pawned item not found." });
        }
        res.json(result[0]);
    });
});

// ✅ Add a new pawned item
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
        res.json({ message: "Pawned item added successfully", id: result.insertId });
    });
});

// ✅ Update a pawned item
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { Pawnticket_ID, Item_Value, Description, Interest, Net_Value, category } = req.body;

    if (!Pawnticket_ID || !Item_Value || !Description || !Interest || !Net_Value || !category) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = `
        UPDATE tbl_item SET Pawnticket_ID = ?, Item_Value = ?, Description = ?, 
        Interest = ?, Net_Value = ?, category = ? WHERE Item_ID = ?
    `;

    db.query(query, [Pawnticket_ID, Item_Value, Description, Interest, Net_Value, category, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error updating item", details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Pawned item not found." });
        }
        res.json({ message: "Pawned item updated successfully" });
    });
});

// ✅ Delete a pawned item
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM tbl_item WHERE Item_ID = ?", [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting item", details: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Pawned item not found." });
        }
        res.json({ message: "Pawned item deleted successfully" });
    });
});

module.exports = router;
