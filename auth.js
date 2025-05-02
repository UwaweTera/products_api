const express = require('express');
const router = express.Router();
const db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'abefghijklmnopqrstuvwxyz1_234567890jdfyhgtuasjgfdsbfeadbmfjdfbvchjdbv_edhs';

// Register user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user
  const query = `INSERT INTO users (email, password) VALUES (?, ?)`;

  db.run(query, [email, hashedPassword], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(400).json({ message: 'User already exists or error occurred' });
    }
    res.json({ message: 'User registered successfully', userId: this.lastID });
  });
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;

  db.get(query, [email], async (err, user) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '72h' });
    res.json({ token });
  });
});

module.exports = router;
