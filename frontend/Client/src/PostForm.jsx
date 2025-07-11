import { useState, useEffect } from "react";

export default function PostForm({ onSubmit, currentPost }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: "",
    likes: 0
  });

  useEffect(() => {
    if (currentPost) {
      setForm({
        _id: currentPost._id,
        title: currentPost.title,
        content: currentPost.content,
        author: currentPost.author,
        likes: currentPost.likes
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
    setForm({ title: "", content: "", author: "", likes: 0 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <input name="content" value={form.content} onChange={handleChange} placeholder="Content" required />
      <input name="author" value={form.author} onChange={handleChange} placeholder="Author" required />
      <input
        name="likes"
        type="number"
        value={form.likes}
        onChange={(e) => setForm((prev) => ({ ...prev, likes: Number(e.target.value) }))}
        placeholder="Likes"
      />
      <button type="submit">{currentPost ? "Update" : "Create"} Post</button>
    </form>
  );
}
