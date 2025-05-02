const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all products
router.get('/', (req, res) => {
  const query = 'SELECT * FROM products';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(rows);
  });
});

// Add new product
router.post('/', (req, res) => {
  const { pname, description, quantity, price } = req.body;
  const query = 'INSERT INTO products (pname, description, quantity, price) VALUES (?, ?, ?, ?)';
  db.run(query, [pname, description, quantity, price], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error inserting product' });
    }
    res.json({ message: 'Product added', pid: this.lastID });
  });
});

// Delete product by id
router.delete('/:pid', (req, res) => {
  const pid = req.params.pid;
  const query = 'DELETE FROM products WHERE pid = ?';
  db.run(query, [pid], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error deleting product' });
    }
    res.json({ message: 'Product deleted' });
  });
});

// PUT: Update entire product by id
router.put('/:pid', (req, res) => {
  const pid = req.params.pid;
  const { pname, description, quantity, price } = req.body;
  const query = 'UPDATE products SET pname = ?, description = ?, quantity = ?, price = ? WHERE pid = ?';
  db.run(query, [pname, description, quantity, price, pid], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error updating product' });
    }
    res.json({ message: 'Product fully updated' });
  });
});

// PATCH: Update part of the product
router.patch('/:pid', (req, res) => {
  const pid = req.params.pid;
  const fields = req.body;

  if (!fields || Object.keys(fields).length === 0) {
    return res.status(400).json({ message: 'No fields provided for update' });
  }

  const updates = Object.keys(fields).map(key => `${key} = ?`).join(', ');
  const values = Object.values(fields);
  values.push(pid);

  const query = `UPDATE products SET ${updates} WHERE pid = ?`;

  db.run(query, values, function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error updating product' });
    }
    res.json({ message: 'Product partially updated' });
  });
});

module.exports = router;
