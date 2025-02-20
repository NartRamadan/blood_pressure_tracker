// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /users - קבלת רשימת המשתמשים
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving users');
    }
});

// POST /users/add - הוספת משתמש חדש
router.post('/add', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send('Name is required');
        }
        const [result] = await db.query('INSERT INTO users (name) VALUES (?)', [name]);
        res.send(`User created with ID: ${result.insertId}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding user');
    }
});

module.exports = router;
