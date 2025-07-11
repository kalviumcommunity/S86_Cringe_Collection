import React from "react";
import PostCard from "./components/PostCard";

const PostList = ({ posts, onEdit, onDelete }) => {
  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PostList;
