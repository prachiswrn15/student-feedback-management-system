const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//  Connect to SQLite DB
const db = new sqlite3.Database('./feedback.db', (err) => {
  if (err) {
    console.error('Error opening DB:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    //  Create feedback table
    db.run(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        subject TEXT,
        rating INTEGER,
        comments TEXT,
        submittedAt TEXT
      )
    `);

    //  Create admin table
    db.run(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      )
    `);
  }
});

//  Admin Register
app.post('/api/admin/register', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO admins (username, password) VALUES (?, ?)`;

  db.run(query, [username, hashedPassword], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(400).json({ error: "Username already exists." });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Admin registered successfully!" });
  });
});

//  Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM admins WHERE username = ?`, [username], async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, row.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful!" });
  });
});

// Add Feedback (POST)
app.post('/api/feedback', (req, res) => {
  const { name, subject, rating, comments, submittedAt } = req.body;

  const query = `
    INSERT INTO feedback (name, subject, rating, comments, submittedAt)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [name, subject, rating, comments, submittedAt], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Feedback submitted successfully!" });
  });
});

// Get All Feedback (GET)
app.get('/api/feedback', (req, res) => {
  db.all(`SELECT * FROM feedback`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Delete Feedback (DELETE)
app.delete('/api/feedback/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM feedback WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Feedback deleted successfully!" });
  });
});

// Add your /api/feedback POST, GET, DELETE routes here

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
