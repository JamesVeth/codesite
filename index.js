const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());

// Serve static files (HTML, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
});

// Update endpoint to match the one used in your HTML file
app.post('/api/appendText', (req, res) => {
    const { content } = req.body;
    const query = 'INSERT INTO text_entries (content) VALUES (?)';
    db.query(query, [content], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database insertion failed' });
        }
        res.status(200).json({ message: 'Text entry added successfully!', id: results.insertId });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
