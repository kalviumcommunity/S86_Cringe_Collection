import { useEffect, useState } from "react";
import PostForm from "./PostForm";
import PostList from "./PostList";

const POSTS_API = "http://localhost:3000/posts";
const USERS_API = "http://localhost:3000/users";
const USER_POSTS_API = "http://localhost:3000/users"; // Will use /:id/posts

export default function App() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [editing, setEditing] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch(USERS_API);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Fetch all posts or posts by selected user
  const fetchPosts = async (userId = null) => {
    try {
      const url = userId ? `${USER_POSTS_API}/${userId}/posts` : POSTS_API;
      const res = await fetch(url);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = async (post) => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `${POSTS_API}/${editing.id}` : POSTS_API;

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      console.error("Failed to save post");
      return;
    }

    setEditing(null);
    fetchPosts(selectedUserId);
  };

  const handleDelete = async (id) => {
    await fetch(`${POSTS_API}/${id}`, { method: "DELETE" });
    fetchPosts(selectedUserId);
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    if (userId) {
      fetchPosts(userId);
    } else {
      fetchPosts(); // all
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Cringe Collection 🫣</h1>

      {/* User Filter Dropdown */}
      <select onChange={handleUserChange} value={selectedUserId || ""}>
        <option value="">All Users</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.username}
          </option>
        ))}
      </select>

      <PostForm
        onSubmit={handleSubmit}
        currentPost={editing}
        users={users}
      />

      <PostList posts={posts} onEdit={setEditing} onDelete={handleDelete} />
    </div>
  );
}
