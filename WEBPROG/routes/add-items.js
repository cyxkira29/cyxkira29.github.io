const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Function to Reset AUTO_INCREMENT if Table is Empty
const resetAutoIncrement = (table) => {
    const query = `SELECT COUNT(*) AS count FROM ${table}`;
    db.query(query, (err, result) => {
        if (err) {
            console.error(`❌ Error checking ${table}:`, err);
            return;
        }
        if (result[0].count === 0) {
            db.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`, (err) => {
                if (err) console.error(`❌ Error resetting ${table}:`, err);
            });
        }
    });
};

// ✅ Reset AUTO_INCREMENT for both tables
resetAutoIncrement("tbl_pawnticket");
resetAutoIncrement("tbl_item");

// ✅ Add a new pawned item
router.post("/", (req, res) => {
    const { customer_id, category, description, item_value, interest, net_value, maturity_date, expiry_date, ticket_number } = req.body;

    // ✅ Check for missing fields
    const requiredFields = ["customer_id", "category", "description", "item_value", "interest", "net_value", "maturity_date", "expiry_date"];
    for (const field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({ status: "error", message: `Missing field: ${field}` });
        }
    }

    // ✅ Check if Customer_ID exists
    const checkCustomerQuery = "SELECT Customer_ID FROM tbl_customer WHERE Customer_ID = ?";
    db.query(checkCustomerQuery, [customer_id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        if (result.length === 0) {
            return res.status(400).json({ status: "error", message: "Invalid Customer_ID. No matching record found." });
        }

        // ✅ Start Transaction
        db.beginTransaction((err) => {
            if (err) return res.status(500).json({ error: "Transaction error", details: err.message });

            let pawnticket_id = ticket_number ? parseInt(ticket_number) : null;

            // ✅ Insert into tbl_pawnticket
            const pawnQuery = pawnticket_id
                ? "INSERT INTO tbl_pawnticket (Pawnticket_ID, Customer_ID, Principal_Value, Maturity_Date, Expiry_Date) VALUES (?, ?, ?, ?, ?)"
                : "INSERT INTO tbl_pawnticket (Customer_ID, Principal_Value, Maturity_Date, Expiry_Date) VALUES (?, ?, ?, ?)";

            const pawnValues = pawnticket_id
                ? [pawnticket_id, customer_id, item_value, maturity_date, expiry_date]
                : [customer_id, item_value, maturity_date, expiry_date];

            db.query(pawnQuery, pawnValues, (err, result) => {
                if (err) {
                    db.rollback(() => res.status(500).json({ error: "Error inserting pawn ticket", details: err.message }));
                    return;
                }

                if (!pawnticket_id) pawnticket_id = result.insertId;

                // ✅ Insert into tbl_item
                const itemQuery = "INSERT INTO tbl_item (Pawnticket_ID, Item_Value, Description, Interest, Net_Value, Category) VALUES (?, ?, ?, ?, ?, ?)";
                const itemValues = [pawnticket_id, item_value, description, interest, net_value, category];

                db.query(itemQuery, itemValues, (err, result) => {
                    if (err) {
                        db.rollback(() => res.status(500).json({ error: "Error inserting item", details: err.message }));
                        return;
                    }

                    const item_id = result.insertId;
                    db.commit((err) => {
                        if (err) {
                            db.rollback(() => res.status(500).json({ error: "Transaction commit failed", details: err.message }));
                            return;
                        }

                        res.json({
                            status: "success",
                            message: "Pawn ticket and item added successfully",
                            pawnticket_id,
                            item_id,
                        });
                    });
                });
            });
        });
    });
});

// ✅ Export the router
module.exports = router;
