import { Link } from "react-router-dom";

export default function PostCard({ post, onDelete }) {
  return (
    <div className="card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p><strong>Author:</strong> {post.author}</p>
      <p><strong>Likes:</strong> {post.likes}</p>
      <Link to={`/edit/${post.id}`}>
        <button>Edit</button>
      </Link>
      <button onClick={() => onDelete(post.id)}>Delete</button>
    </div>
  );
}
