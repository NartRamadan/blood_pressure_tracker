// routes/measurements.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /measurements/add - טופס EJS להוספת מדידה
router.get('/add', async (req, res) => {
    try {
        // נשלוף את המשתמשים כדי להציג בדרופדאון
        const [users] = await db.query('SELECT id, name FROM users');
        // נרנדר את התבנית עם רשימת המשתמשים
        res.render('measurements_add', { users });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading measurement form');
    }
});

// POST /measurements/add - שמירת מדידה חדשה במסד
router.post('/add', async (req, res) => {
    try {
        const { user_id, measurement_date, low_value, high_value, pulse } = req.body;
        if (!user_id || !measurement_date || !low_value || !high_value || !pulse) {
            return res.status(400).send('Missing required fields');
        }

        const [result] = await db.query(`
      INSERT INTO measurements (user_id, measurement_date, low_value, high_value, pulse)
      VALUES (?, ?, ?, ?, ?)
    `, [user_id, measurement_date, low_value, high_value, pulse]);

        res.send(`Measurement added with ID: ${result.insertId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding measurement');
    }
});

// GET /measurements - להחזיר את כל המדידות (כ־JSON, בינתיים)
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM measurements');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving measurements');
    }
});

module.exports = router;
