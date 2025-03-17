const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Allow CORS (Cross-Origin Requests)
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, POST, UPDATE");
    next();
});

// ✅ Fetch all customers
router.get("/", (req, res) => {
    const query = `
        SELECT Customer_ID, Customer_FirstName, Customer_MiddleInitial, 
               Customer_LastName, Customer_Birthday, Customer_Address, 
               Customer_Nationality, Customer_Gender, Status 
        FROM tbl_customer
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Error fetching customers:", err);
            return res.status(500).json({ status: "error", message: "Error fetching customers", details: err.message });
        }

        if (results.length === 0) {
            return res.json({ status: "error", message: "No customers found." });
        }

        res.json({ status: "success", data: results });
    });
});

// ✅ Export the router
module.exports = router;
