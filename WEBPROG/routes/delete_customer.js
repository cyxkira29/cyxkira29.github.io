const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Delete a customer by ID
router.delete("/:id", (req, res) => {
    const customerID = req.params.id;

    // ✅ Corrected SQL Query
    const query = "DELETE FROM tbl_customer WHERE Customer_ID = ?";

    db.query(query, [customerID], (err, result) => {
        if (err) {
            console.error("❌ Error deleting customer:", err);
            return res.status(500).json({ error: "Error deleting customer" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "⚠️ Customer not found!" });
        }

        res.json({ message: "✅ Customer deleted successfully!" });
    });
});

module.exports = router;
