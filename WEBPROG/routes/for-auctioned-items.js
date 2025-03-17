    const express = require("express");
    const router = express.Router();
    const db = require("../db"); // Import MySQL connection

    // ✅ Fetch All Auctioned Items
    router.get("/", (req, res) => {
        const sql = `
            SELECT Item_ID, Description, Item_Value, Net_Value
            FROM tbl_auctioned_items;
        `;

        db.query(sql, (err, results) => {
            if (err) {
                console.error("❌ Database Error:", err);
                return res.status(500).json({ error: `❌ Internal Server Error: ${err.message}` });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "⚠️ No auctioned items found." });
            }
            res.json(results); // ✅ Directly returning an array (matches your customer route)
        });
    });

    // ✅ Fetch Single Auctioned Item by ID
    router.get("/:id", (req, res) => {
        const sql = "SELECT * FROM tbl_auctioned_items WHERE Item_ID = ?";
        db.query(sql, [req.params.id], (err, result) => {
            if (err) return res.status(500).json({ error: `❌ Database Error: ${err.message}` });
            if (result.length === 0) return res.status(404).json({ error: "⚠️ Item not found!" });
            res.json(result[0]);
        });
    });

    module.exports = router;
