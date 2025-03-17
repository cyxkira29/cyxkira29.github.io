const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Update customer details
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const {
        Customer_FirstName,
        Customer_MiddleInitial,
        Customer_LastName,
        Customer_Gender,
        Customer_Address,
        Customer_Birthday,
        Customer_Nationality,
        Status
    } = req.body;

    db.query(
        "UPDATE customers SET Customer_FirstName=?, Customer_MiddleInitial=?, Customer_LastName=?, Customer_Gender=?, Customer_Address=?, Customer_Birthday=?, Customer_Nationality=?, Status=? WHERE Customer_ID=?",
        [Customer_FirstName, Customer_MiddleInitial, Customer_LastName, Customer_Gender, Customer_Address, Customer_Birthday, Customer_Nationality, Status, id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "Customer not found." });
            }
            res.status(200).json({ status: "success", message: "Customer updated successfully!" });
        }
    );
});

module.exports = router;
