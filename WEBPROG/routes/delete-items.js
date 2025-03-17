const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Delete an item by ID
router.delete("/pawned-items/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM pawned_items WHERE Item_ID = ?", [id], (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Item not found." });
        }
        res.status(200).json({ status: "success", message: "Item deleted successfully!" });
    });
});

module.exports = router;
