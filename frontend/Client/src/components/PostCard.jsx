import React from "react";

const PostCard = ({ post, onEdit, onDelete }) => {
  return (
    <div style={styles.card}>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <small>By: {post.author}</small>
      <p>Likes: {post.likes}</p>
      <p>Tags: {post.tags?.join(", ")}</p>
      <p>Posted on: {new Date(post.createdAt).toLocaleString()}</p>
      <button onClick={() => onEdit(post)}>Edit</button>
      <button onClick={() => onDelete(post._id)}>Delete</button>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid gray",
    padding: "16px",
    borderRadius: "8px",
    margin: "12px 0",
    backgroundColor: "#fff",
  }
};

export default PostCard;
