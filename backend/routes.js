const express = require('express');
const router = express.Router();
const db = require('./db');
const jwt = require('jsonwebtoken');
const secret = 'your_jwt_secret_key'; // Change this in production

// --- AUTH ROUTES --- //

// LOGIN (JWT + Cookie)
router.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  // Token payload can include anything
  const token = jwt.sign({ username }, secret, { expiresIn: '1d' });

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  });

  res.json({ message: `Logged in as ${username}` });
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Protected route (example)
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you are authenticated.` });
});


// --- POST ROUTES --- //

router.post('/posts', (req, res) => {
  const { title, content, author, likes = 0, tags = "", created_by } = req.body;
  if (!title || !content || !author || !created_by) {
    return res.status(400).json({ error: "Title, content, author, and created_by are required." });
  }

  const query = `INSERT INTO posts (title, content, author, likes, tags, created_by) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(query, [title, content, author, likes, tags.toString(), created_by], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, title, content, author, likes, tags, created_by });
  });
});

router.get('/posts', (req, res) => {
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/posts/:id', (req, res) => {
  db.query('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Post not found' });
    res.json(results[0]);
  });
});

router.put('/posts/:id', (req, res) => {
  const { title, content, author, likes = 0, tags = "", created_by } = req.body;
  if (!title || !content || !author || !created_by) {
    return res.status(400).json({ error: "Title, content, author, and created_by are required." });
  }

  const query = `
    UPDATE posts 
    SET title = ?, content = ?, author = ?, likes = ?, tags = ?, created_by = ?
    WHERE id = ?
  `;
  db.query(query, [title, content, author, likes, tags.toString(), created_by, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Post updated" });
  });
});

router.delete('/posts/:id', (req, res) => {
  db.query('DELETE FROM posts WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: "Post deleted" });
  });
});

// --- USERS --- //

router.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/users/:id/posts', (req, res) => {
  const userId = req.params.id;
  db.query('SELECT * FROM posts WHERE created_by = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
