// routes/measurements.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /measurements - החזרת כל המדידות
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM measurements');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving measurements');
    }
});

// POST /measurements/add - הוספת מדידה חדשה
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

module.exports = router;
