import { useEffect, useState } from "react";
import PostForm from "./PostForm";
import PostList from "./PostList";

const API_URL = "http://localhost:3000/posts";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (post) => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API_URL}/${editing._id}` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    setEditing(null);
    fetchPosts();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  return (
    <div>
      <h1>Cringe Collection 🫣</h1>
      <PostForm onSubmit={handleSubmit} currentPost={editing} />
      <PostList posts={posts} onEdit={setEditing} onDelete={handleDelete} />
    </div>
  );
}
