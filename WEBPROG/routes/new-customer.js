const express = require('express');
const router = express.Router();
const db = require('../db'); // Import MySQL connection from db.js

// ✅ Get All Customers
router.get('/', (req, res) => {
    const sql = "SELECT * FROM tbl_customer";
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ error: `❌ Database Error: ${err.message}` });
        res.json(result);
    });
});

// ✅ Get Single Customer by ID
router.get('/:id', (req, res) => {
    const sql = "SELECT * FROM tbl_customer WHERE Customer_ID = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: `❌ Database Error: ${err.message}` });
        if (result.length === 0) return res.status(404).json({ error: "⚠️ Customer not found!" });
        res.json(result[0]);
    });
});

// ✅ Add New Customer (Validation Added)
router.post('/', (req, res) => {
    const { Customer_FirstName, Customer_MiddleInitial, Customer_LastName, Customer_Birthday, Customer_Address, Customer_Nationality, Customer_Gender } = req.body;

    if (!Customer_FirstName || !Customer_LastName) {
        return res.status(400).json({ error: "⚠️ First name and last name are required!" });
    }

    const sql = `INSERT INTO tbl_customer (Customer_FirstName, Customer_MiddleInitial, Customer_LastName, Customer_Birthday, Customer_Address, Customer_Nationality, Customer_Gender, Status) VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')`;

    db.query(sql, [Customer_FirstName, Customer_MiddleInitial, Customer_LastName, Customer_Birthday, Customer_Address, Customer_Nationality, Customer_Gender], (err, result) => {
        if (err) return res.status(500).json({ error: `❌ Database Error: ${err.message}` });
        res.json({ message: "✅ Customer Added!", customerID: result.insertId });
    });
});

// ✅ Update Customer (Validation Added)
router.put('/:id', (req, res) => {
    const { Customer_FirstName, Customer_MiddleInitial, Customer_LastName, Customer_Birthday, Customer_Address, Customer_Nationality, Customer_Gender } = req.body;

    if (!Customer_FirstName || !Customer_LastName) {
        return res.status(400).json({ error: "⚠️ First name and last name are required!" });
    }

    const sql = `UPDATE tbl_customer SET Customer_FirstName=?, Customer_MiddleInitial=?, Customer_LastName=?, Customer_Birthday=?, Customer_Address=?, Customer_Nationality=?, Customer_Gender=? WHERE Customer_ID=?`;

    db.query(sql, [Customer_FirstName, Customer_MiddleInitial, Customer_LastName, Customer_Birthday, Customer_Address, Customer_Nationality, Customer_Gender, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: `❌ Database Error: ${err.message}` });
        if (result.affectedRows === 0) return res.status(404).json({ error: "⚠️ Customer not found!" });
        res.json({ message: "✅ Customer Updated!" });
    });
});

// ✅ Delete Customer (Prevent Accidental Deletion)
router.delete('/:id', (req, res) => {
    const sql = "DELETE FROM tbl_customer WHERE Customer_ID = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: `❌ Database Error: ${err.message}` });
        if (result.affectedRows === 0) return res.status(404).json({ error: "⚠️ Customer not found!" });
        res.json({ message: "❌ Customer Deleted!" });
    });
});

// ✅ Toggle Customer Status (Prevents Invalid Status)
router.patch('/:id/status', (req, res) => {
    const { status } = req.body;
    if (!["Active", "Inactive"].includes(status)) {
        return res.status(400).json({ error: "⚠️ Invalid status value!" });
    }

    const sql = "UPDATE tbl_customer SET Status = ? WHERE Customer_ID = ?";
    db.query(sql, [status, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ error: `❌ Database Error: ${err.message}` });
        if (result.affectedRows === 0) return res.status(404).json({ error: "⚠️ Customer not found!" });
        res.json({ message: `✅ Customer status updated to ${status}` });
    });
});

module.exports = router;
