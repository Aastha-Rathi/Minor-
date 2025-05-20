import React from "react";
import { useNavigate } from "react-router-dom";

const SearchResultCard = ({ profile }) => {
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    // Use userId for navigation, fallback to id if userId is not available
    const profileId = profile.userId || profile._id || profile.id;
    navigate(`/profile/${profileId}`);
  };
  
  return (
    <div className="bg-trippiko-card rounded-lg p-4 flex flex-col md:flex-row items-center gap-4">
      <img 
        src={profile.profilePic || "https://via.placeholder.com/60"} 
        alt={profile.name || profile.username} 
        className="w-16 h-16 rounded-full object-cover" 
      />
      <div className="flex-1">
        <h3 className="font-bold text-trippiko-accent">{profile.name || profile.username}</h3>
        <p className="text-trippiko-light">{profile.bio || "No bio available"}</p>
        
        {profile.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-trippiko-accent text-trippiko-dark px-2 py-1 rounded text-xs">
              {profile.travelerType || "traveler"}
            </span>
            {profile.interests.slice(0, 3).map((interest, idx) => (
              <span key={idx} className="bg-trippiko-light text-trippiko-dark px-2 py-1 rounded text-xs">
                {interest}
              </span>
            ))}
          </div>
        )}
      </div>
      <button onClick={handleViewProfile} className="bg-trippiko-accent text-trippiko-dark px-4 py-2 rounded">
        View Profile
      </button>
    </div>
  );
};

export default SearchResultCard;
