const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// 

// MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect();

// Endpoint to append text
app.post('/api/appendText', (req, res) => {
  const content = req.body.content;
  const words = content.split(' ').slice(-10).join(' ');

  connection.query('INSERT INTO text_logs (content) VALUES (?)', [content], (err) => {
    if (err) throw err;
    connection.query('SELECT content FROM text_logs ORDER BY id DESC LIMIT 10', (err, results) => {
      if (err) throw err;
      const last10Words = results.map(row => row.content).join(' ').split(' ').slice(-10);
      res.json({ words: last10Words });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
