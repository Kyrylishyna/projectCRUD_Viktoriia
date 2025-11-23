const mysql = require('mysql2/promise');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("DATABASE_URL env variable is missing");
}

const db = mysql.createPool(dbUrl);

db.getConnection()
  .then(conn => {
    console.log("✅ Connected to MySQL successfully");
    conn.release();
  })
  .catch(err => {
    console.error("❌ MySQL connection error:", err);
  });

module.exports = db;

