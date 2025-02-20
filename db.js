// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',          // או שם משתמש אחר
    password: '',          // סיסמה אם יש
    database: 'blood_pressure_db'
});

module.exports = pool.promise();
