const mysql = require("mysql2");

const dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "samarena_pawnshop",
    port: 3308
};

let db;

function handleDisconnect() {
    db = mysql.createConnection(dbConfig);
    
    db.connect((err) => {
        if (err) {
            console.error("❌ MySQL Connection Error:", err.message);
            setTimeout(handleDisconnect, 2000); // Retry after 2 sec
        } else {
            console.log("✅ Connected to MySQL Database: samarena_pawnshop");
        }
    });

    db.on("error", (err) => {
        console.error("❌ MySQL Error:", err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = db;