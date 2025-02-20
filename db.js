const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // אם אין סיסמה, השאר ככה
    database: 'blood_pressure_db'
});

module.exports = pool.promise();
