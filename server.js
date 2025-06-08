const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

// Mongoose Model
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const CringePost = mongoose.model('CringePost', postSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Ping Endpoint
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Get all cringe posts
app.get('/posts', async (req, res) => {
  const posts = await CringePost.find();
  res.json(posts);
});

// Get a single post by ID
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await CringePost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// Create a new post
app.post('/posts', async (req, res) => {
  const { title, content } = req.body;
  const newPost = new CringePost({ title, content });
  await newPost.save();
  res.status(201).json(newPost);
});

// Update a post by ID
app.put('/posts/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedPost = await CringePost.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    if (!updatedPost) return res.status(404).json({ error: "Post not found" });
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// Delete a post by ID
app.delete('/posts/:id', async (req, res) => {
  try {
    const deletedPost = await CringePost.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted", post: deletedPost });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
