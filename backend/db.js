const mysql = require('mysql2/promise');
require('dotenv').config();

const urlDB = `mysql://root:DSlZkNXyomXbbXvvEsasPcZGaJkIepxO@mysql.railway.internal:3306/railway`;
const db = mysql.createPool(urlDB);

module.exports = db;