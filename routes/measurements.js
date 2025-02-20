// routes/measurements.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// פונקציית עזר לחישוב ממוצע
function average(arr) {
    if (!arr || arr.length === 0) return 0;
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
}

// GET /measurements/report - דוח חודשי לכל המשתמשים
router.get('/report', async (req, res) => {
    try {
        // 1. אם אין year/month בפרמטרים, נציג רק את הטופס
        const { year, month } = req.query;
        if (!year || !month) {
            return res.render('measurements_report', {
                reportData: null,
                chosenYear: null,
                chosenMonth: null
            });
        }

        // 2. שליפת כל המדידות של כל המשתמשים לחודש ושנה מסוימים
        //    נחבר את users כדי שנדע את שם המשתמש
        const sql = `
      SELECT m.*, u.name AS userName
      FROM measurements m
      JOIN users u ON m.user_id = u.id
      WHERE YEAR(m.measurement_date) = ?
        AND MONTH(m.measurement_date) = ?
      ORDER BY m.user_id
    `;
        const [rows] = await db.query(sql, [year, month]);

        // אם אין מדידות בחודש הזה, נחזיר טבלה ריקה
        if (rows.length === 0) {
            return res.render('measurements_report', {
                reportData: [],
                chosenYear: year,
                chosenMonth: month
            });
        }

        // 3. נקבץ את המדידות לפי user_id כדי לחשב ממוצעים וחריגות לכל משתמש
        const usersData = {};

        for (const row of rows) {
            const userId = row.user_id;
            if (!usersData[userId]) {
                usersData[userId] = {
                    userName: row.userName,
                    lowValues: [],
                    highValues: [],
                    pulseValues: []
                };
            }
            usersData[userId].lowValues.push(row.low_value);
            usersData[userId].highValues.push(row.high_value);
            usersData[userId].pulseValues.push(row.pulse);
        }

        // 4. כעת נחשב לכל משתמש ממוצע, ואז נספור כמה מדידות חריגות יש
        //    הגדרת "חריגה": ערך גבוה ב-20% מהממוצע
        const reportData = [];

        for (const userId in usersData) {
            const user = usersData[userId];
            const avgLow = average(user.lowValues);
            const avgHigh = average(user.highValues);
            const avgPulse = average(user.pulseValues);

            // ספירת חריגות (low או high מעל 120% מהממוצע)
            let outliersCount = 0;

            for (let i = 0; i < user.lowValues.length; i++) {
                const lowVal = user.lowValues[i];
                const highVal = user.highValues[i];
                // אפשר גם לבדוק חריגות דופק, אם רוצים
                if (lowVal > avgLow * 1.2 || highVal > avgHigh * 1.2) {
                    outliersCount++;
                }
            }

            reportData.push({
                userName: user.userName,
                avgLow,
                avgHigh,
                avgPulse,
                outliersCount
            });
        }

        // 5. שולחים ל־EJS את התוצאות
        res.render('measurements_report', {
            reportData,
            chosenYear: year,
            chosenMonth: month
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating monthly report');
    }
});

module.exports = router;
