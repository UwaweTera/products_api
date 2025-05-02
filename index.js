const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./products');
const authRoutes = require('./auth');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'abefghijklmnopqrstuvwxyz1_234567890jdfyhgtuasjgfdsbfeadbmfjdfbvchjdbv_edhs';

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 'Bearer TOKEN'

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user; // Save user info
    next();
  });
}
// Simple root route
app.get('/', (req, res) => {
  res.send('✅ Server is running!');
});

app.use('/auth', authRoutes);
app.use('/products', authenticateToken, productRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
