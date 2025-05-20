import React from "react";
import { Link } from "react-router-dom";

const FeedPost = ({ post }) => {
  // Format date from ISO string to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Handle missing data gracefully
  const imageUrl = post.imageUrl || "https://via.placeholder.com/800x600?text=No+Image";
  const title = post.title || "Untitled Story";
  const location = post.visitedLocation || "Unknown location";
  const story = post.story || "";
  const username = post.username || "Anonymous";
  const visitedDate = formatDate(post.visitedDate);
  const createdAt = formatDate(post.createdAt);

  return (
    <div className="bg-trippiko-card rounded-lg shadow p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl text-trippiko-accent">{title}</h3>
        <span className="text-sm text-trippiko-light">by <Link to={`/profile/${post.userId}`} className="text-trippiko-accent underline">{username}</Link></span>
      </div>
      
      <img src={imageUrl} alt={title} className="rounded-lg w-full h-64 object-cover" />
      
      <div className="flex justify-between items-center">
        <span className="font-medium text-trippiko-accent">{location}</span>
        <span className="text-sm text-trippiko-light">Visited: {visitedDate}</span>
      </div>

      <p className="text-trippiko-light">{story.length > 200 ? story.substring(0, 200) + "..." : story}</p>
      
      <div className="flex justify-between items-center text-sm text-trippiko-light">
        <span>Posted: {createdAt}</span>
        <div className="flex gap-4">
          <button className="hover:text-trippiko-accent">❤️ Like</button>
          <button className="hover:text-trippiko-accent">💬 Comment</button>
          <button className="hover:text-trippiko-accent">🔄 Share</button>
        </div>
      </div>
    </div>
  );
};

export default FeedPost;
