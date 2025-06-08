const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Dummy data to simulate a database
let cringePosts = [
  { id: 1, title: "Awkward Zoom moment", content: "Forgot camera was on!" },
  { id: 2, title: "Wrong chat", content: "Sent a meme to my professor 😳" }
];

// Ping Endpoint
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Get all cringe posts
app.get('/posts', (req, res) => {
  res.json(cringePosts);
});

// Get a single post by ID
app.get('/posts/:id', (req, res) => {
  const post = cringePosts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

// Create a new post
app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: cringePosts.length + 1,
    title,
    content
  };
  cringePosts.push(newPost);
  res.status(201).json(newPost);
});

// Update a post by ID
app.put('/posts/:id', (req, res) => {
  const { title, content } = req.body;
  const post = cringePosts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: "Post not found" });

  post.title = title || post.title;
  post.content = content || post.content;

  res.json(post);
});

// Delete a post by ID
app.delete('/posts/:id', (req, res) => {
  const index = cringePosts.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Post not found" });

  const deletedPost = cringePosts.splice(index, 1);
  res.json({ message: "Post deleted", post: deletedPost });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
