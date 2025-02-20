//npm install express body-parser ejs mysql2

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// הגדרת שימוש ב־body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// הגדרת מנוע התבניות (EJS)
app.set('view engine', 'ejs');

// דוגמה לנתיב ראשוני
app.get('/', (req, res) => {
    res.send('ברוך הבא לשרת מעקב לחץ דם!');
});

// הפעלת השרת על פורט 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
