// components/UpdatePostPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/posts";

export default function UpdatePostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: "",
    likes: 0
  });

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    navigate("/"); // Redirect back to list page
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update Post</h2>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <input name="content" value={form.content} onChange={handleChange} placeholder="Content" required />
      <input name="author" value={form.author} onChange={handleChange} placeholder="Author" required />
      <input name="likes" type="number" value={form.likes} onChange={handleChange} placeholder="Likes" />
      <button type="submit">Update Post</button>
    </form>
  );
}
