import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeedPost from "../components/FeedPost";
import travelStoryService from "../services/travelStoryService";
import profileService from "../services/profileService";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch travel stories
        const stories = await travelStoryService.getAllTravelStories();
        setPosts(stories || []);
        
        // Try to fetch profiles by destination search
        try {
          // Search for users interested in a common destination
          const usersByDestination = await profileService.searchByDestination("travel");
          setProfiles(usersByDestination || []);
        } catch (err) {
          console.error("Failed to fetch profiles:", err);
          setProfiles([]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-heading text-trippiko-accent mb-6">Discover Fellow Travelers</h1>
      
      {/* User Profiles Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-trippiko-accent mb-4">Travel Community</h2>
        
        {profiles.length > 0 ? (
          <div className="grid gap-6">
            {profiles.map((profile) => (
              <div key={profile.userId} className="bg-trippiko-card rounded-lg shadow overflow-hidden">
                <Link to={`/profile/${profile.userId}`}>
                  <div className="flex items-center p-4">
                    <img 
                      src={profile.profilePic || "https://via.placeholder.com/60"} 
                      alt={profile.name} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-trippiko-accent">{profile.name}</h3>
                      <p className="text-trippiko-light text-sm">{profile.bio}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-trippiko-accent text-trippiko-dark px-2 py-1 rounded text-xs">
                          {profile.travelerType || "traveler"}
                        </span>
                        
                        {profile.interests?.slice(0, 3).map((interest, idx) => (
                          <span key={idx} className="bg-trippiko-light text-trippiko-dark px-2 py-1 rounded text-xs">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-trippiko-card rounded-lg">
            <p className="text-trippiko-light">No travelers found. Be the first to share your travel plans!</p>
          </div>
        )}
      </section>

      {/* Recent Posts Section */}
      <section>
        <h2 className="text-2xl font-bold text-trippiko-accent mb-4">Recent Travel Stories</h2>
        
        {posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.slice(0, 3).map((post) => (
              <FeedPost key={post._id || post.id} post={post} />
            ))}
            
            {posts.length > 3 && (
              <div className="text-center py-4">
                <Link to="/explore" className="text-trippiko-accent hover:underline">
                  View More Travel Stories →
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 bg-trippiko-card rounded-lg">
            <p className="text-trippiko-light">No travel stories yet. Be the first to share your adventure!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
