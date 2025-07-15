const express = require('express');
const router = express.Router();

let posts = [
  {
    id: 1,
    title: "Awkward Zoom moment",
    content: "Forgot camera was on!",
    author: "kartheekreddy",
    likes: 5,
    tags: ["zoom", "class", "oops"],
    createdAt: new Date()
  },
  {
    id: 2,
    title: "Wrong chat message",
    content: "Sent meme to teacher instead of friend 😅",
    author: "kartheekreddy",
    likes: 7,
    tags: ["meme", "fail"],
    createdAt: new Date()
  }
];

//  CREATE
router.post('/posts', (req, res) => {
  const { title, content, author, likes, tags } = req.body;

  //  Validation
  if (!title || !content || !author) {
    return res.status(400).json({ error: "Title, content, and author are required." });
  }
  if (likes !== undefined && typeof likes !== "number") {
    return res.status(400).json({ error: "Likes must be a number." });
  }
  if (tags && !Array.isArray(tags)) {
    return res.status(400).json({ error: "Tags must be an array." });
  }

  const newPost = {
    id: posts.length + 1,
    title,
    content,
    author,
    likes: likes || 0,
    tags: tags || [],
    createdAt: new Date()
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// READ ALL
router.get('/posts', (req, res) => {
  res.json(posts);
});

//  READ ONE
router.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

//  UPDATE
router.put('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const { title, content, author, likes, tags } = req.body;

  // Validation
  if (!title || !content || !author) {
    return res.status(400).json({ error: "Title, content, and author are required." });
  }
  if (likes !== undefined && typeof likes !== "number") {
    return res.status(400).json({ error: "Likes must be a number." });
  }
  if (tags && !Array.isArray(tags)) {
    return res.status(400).json({ error: "Tags must be an array." });
  }

  post.title = title;
  post.content = content;
  post.author = author;
  post.likes = likes || 0;
  post.tags = tags || [];

  res.json(post);
});

//  DELETE
router.delete('/posts/:id', (req, res) => {
  const index = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Post not found' });

  const deleted = posts.splice(index, 1);
  res.json({ message: "Post deleted", post: deleted[0] });
});

module.exports = router;
