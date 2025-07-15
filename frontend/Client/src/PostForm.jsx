import { useState, useEffect } from "react";

export default function PostForm({ onSubmit, currentPost, users = [] }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: "",
    likes: 0,
    tags: "",
    created_by: ""
  });

  useEffect(() => {
    if (currentPost) {
      setForm({
        title: currentPost.title || "",
        content: currentPost.content || "",
        author: currentPost.author || "",
        likes: currentPost.likes || 0,
        tags: currentPost.tags || "",
        created_by: currentPost.created_by || ""
      });
    }
  }, [currentPost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      title: "",
      content: "",
      author: "",
      likes: 0,
      tags: "",
      created_by: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        required
      />
      <input
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="Content"
        required
      />
      <input
        name="author"
        value={form.author}
        onChange={handleChange}
        placeholder="Author"
        required
      />
      <input
        name="likes"
        type="number"
        value={form.likes}
        onChange={handleChange}
        placeholder="Likes"
      />
      <input
        name="tags"
        value={form.tags}
        onChange={handleChange}
        placeholder="Comma-separated tags"
      />

      <select
        name="created_by"
        value={form.created_by}
        onChange={handleChange}
        required
      >
        <option value="">Select Creator</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>

      <button type="submit">
        {currentPost ? "Update" : "Create"} Post
      </button>
    </form>
  );
}
