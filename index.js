// index.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const usersRouter = require('./routes/users');
const measurementsRouter = require('./routes/measurements');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

// נתיב בסיסי לדוגמה
app.get('/', (req, res) => {
    res.send('Hello from Blood Pressure Tracker!');
});

// שימוש בראוטרים
app.use('/users', usersRouter);
app.use('/measurements', measurementsRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
