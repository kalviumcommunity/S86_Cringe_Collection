export default function PostList({ posts, onEdit, onDelete }) {
  return (
    <div>
      <h2>All Cringe Posts</h2>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <p>By: {post.author} | Likes: {post.likes}</p>
          <button onClick={() => onEdit(post)}>Edit</button>
          <button onClick={() => onDelete(post.id)}>Delete</button>
          <hr />
        </div>
      ))}
    </div>
  );
}
