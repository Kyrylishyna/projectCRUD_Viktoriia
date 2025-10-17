const mysql = require('mysql2/promise');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL env variable is missing");
}

const db = mysql.createPool(process.env.DATABASE_URL);

module.exports = db;