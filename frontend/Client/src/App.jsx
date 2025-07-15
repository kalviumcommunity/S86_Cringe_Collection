import { useState, useEffect } from "react";
import PostForm from "./PostForm";
import PostList from "./PostList";

const API_URL = "http://localhost:3000";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [username, setUsername] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  const fetchPosts = async () => {
    try {
      const url = selectedUserId
        ? `${API_URL}/users/${selectedUserId}/posts`
        : `${API_URL}/posts`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setLoggedInUser(data.message);
      }
    } catch (err) {
      console.error("Auth check failed", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
    checkAuth();
  }, [selectedUserId]);

  const handleSubmit = async (post) => {
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `${API_URL}/posts/${editing.id}`
      : `${API_URL}/posts`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(post),
    });

    setEditing(null);
    fetchPosts();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchPosts();
  };

  const handleLogin = async () => {
    await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username }),
    });
    setUsername("");
    checkAuth();
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    setLoggedInUser(null);
  };

  return (
    <div>
      <h1>Cringe Collection 🫣</h1>

      {!loggedInUser ? (
        <div>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <p>Welcome, {loggedInUser}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      <select onChange={(e) => setSelectedUserId(e.target.value)} value={selectedUserId}>
        <option value="">-- Filter by user --</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.username}
          </option>
        ))}
      </select>

      <PostForm onSubmit={handleSubmit} currentPost={editing} />
      <PostList posts={posts} onEdit={setEditing} onDelete={handleDelete} />
    </div>
  );
}
