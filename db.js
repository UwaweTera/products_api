const sqlite3 = require('sqlite3').verbose();

// Create or connect to the SQLite database file
const db = new sqlite3.Database('./firstapi.db', (err) => {
  if (err) {
    return console.error('Error opening database:', err.message);
  }
  console.log('Connected to SQLite database');

  // Create products table if not exists
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      pid INTEGER PRIMARY KEY AUTOINCREMENT,
      pname TEXT NOT NULL,
      description TEXT,
      quantity INTEGER,
      price REAL
    )
  `;

  // Create users table if not exists
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `;

  db.run(createProductsTable, (err) => {
    if (err) return console.error('Error creating products table:', err.message);
    console.log('Products table ready');
  });

  db.run(createUsersTable, (err) => {
    if (err) return console.error('Error creating users table:', err.message);
    console.log('Users table ready');
  });
});

module.exports = db;
