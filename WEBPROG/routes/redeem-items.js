const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Get all redeemed items
router.get("/", (req, res) => {
    const query = `
        SELECT r.Redeemed_ID, r.Pawnticket_ID, r.Item_Value, r.Redeemed_Value, r.Redeemed_Date,
               IFNULL(i.Description, 'N/A') AS Description, 
               IFNULL(i.category, 'N/A') AS Category
        FROM tbl_redeemed_items r
        LEFT JOIN tbl_item i ON r.Pawnticket_ID = i.Pawnticket_ID
        AND r.Item_Value = i.Item_Value
        ORDER BY r.Redeemed_Date ASC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Error fetching redeemed items:", err);
            return res.status(500).json({ error: "Error fetching redeemed items", details: err.message });
        }

        // ✅ Format the results
        const items = results.map((row) => ({
            Redeemed_ID: row.Redeemed_ID,
            Pawnticket_ID: row.Pawnticket_ID,
            Item_Value: parseFloat(row.Item_Value).toFixed(2),
            Redeemed_Value: parseFloat(row.Redeemed_Value).toFixed(2),
            Redeemed_Date: new Date(row.Redeemed_Date).toISOString().replace("T", " ").substring(0, 19),
            Description: row.Description || "N/A",
            Category: row.Category || "N/A",
        }));

        res.json(items);
    });
});

// ✅ Export the router
module.exports = router;
