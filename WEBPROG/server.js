const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config(); 

const newCustomerRoutes = require("./routes/new-customer");
const allPawnedItemsRoutes = require("./routes/all-pawned-items");
const forAuctionedItemsRoutes = require("./routes/for-auctioned-items");
const addItemsRoutes = require("./routes/add-items");
const redeemedItemsRoutes = require("./routes/redeem-items"); 
const fetchCustomersRoutes = require("./routes/fetch_customers"); 
const deleteCustomerRoutes = require("./routes/delete_customer"); // ✅ Corrected route name

const app = express();

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ✅ Serve static files correctly
app.use(express.static(path.join(__dirname, "public")));

// ✅ Fix MIME-type issues by setting correct headers
app.use((req, res, next) => {
    if (req.path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
    } else if (req.path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
    }
    next();
});

// ✅ Serve `new-customer.html` correctly
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "new-customer.html"));
});

// ✅ API Routes
app.use("/new-customer", newCustomerRoutes); 
app.use("/all-pawned-items", allPawnedItemsRoutes);
app.use("/for-auctioned-items", forAuctionedItemsRoutes);
app.use("/add-items", addItemsRoutes);
app.use("/redeem-items", redeemedItemsRoutes); 
app.use("/fetch-customers", fetchCustomersRoutes);
app.use("/delete-customer", deleteCustomerRoutes); // ✅ Fixed to match frontend request

// ✅ Handle Unknown Routes (404 Not Found)
app.use((req, res) => {
    res.status(404).json({ error: "⚠️ Route not found!" });
});

// ✅ Start Server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});

// ✅ Error Handling
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Promise Rejection:", reason);
});
