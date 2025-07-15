const express = require('express');
const router = express.Router();
const db = require('./db');

// Create a new post
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

// Get all posts
router.get('/posts', (req, res) => {
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get a single post by ID
router.get('/posts/:id', (req, res) => {
  db.query('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Post not found' });
    res.json(results[0]);
  });
});

// Update a post
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

// Delete a post
router.delete('/posts/:id', (req, res) => {
  db.query('DELETE FROM posts WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: "Post deleted" });
  });
});

// Get all users
router.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get posts by a specific user
router.get('/users/:id/posts', (req, res) => {
  const userId = req.params.id;
  db.query('SELECT * FROM posts WHERE created_by = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
