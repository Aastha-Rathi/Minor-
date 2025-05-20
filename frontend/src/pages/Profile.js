import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import FeedPost from "../components/FeedPost";
import profileService from "../services/profileService";
import travelStoryService from "../services/travelStoryService";
import authService from "../services/authService";

const Profile = () => {
  const { userId } = useParams();
  const currentUser = authService.getUserInfo();
  const [profile, setProfile] = useState(null);
  const [userStories, setUserStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug userId parameter with more info
  useEffect(() => {
    console.log("Profile page load:", { 
      urlParam: userId, 
      urlParamType: typeof userId,
      currentUser,
      currentUserId: currentUser?.userId,
      currentUserIdType: typeof currentUser?.userId
    });
    
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let userProfile;
      let stories;
      
      // If viewing someone else's profile
      if (userId) {
        try {
          // Try to get user profile by userId through the API
          userProfile = await profileService.getUserProfileById(userId);
          
          // If no profile found, create a minimal profile with the userId
          if (!userProfile) {
            userProfile = {
              userId: userId,
              name: "User",
              bio: "No bio available",
              profilePic: "https://via.placeholder.com/150",
              interests: [],
              preferredDestinations: []
            };
          }
          
          // FIXED: Always ensure userId is explicitly set as a string
          userProfile.userId = String(userId);
          
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
          // Create a minimal profile with the userId if there's an error
          userProfile = {
            userId: String(userId),
            name: "User",
            bio: "Could not load profile",
            profilePic: "https://via.placeholder.com/150",
            interests: [],
            preferredDestinations: []
          };
        }
        
        stories = await travelStoryService.getUserTravelStories(userId);
      } 
      // If viewing own profile
      else {
        try {
          userProfile = await profileService.getProfile();
          
          // FIXED: Always set userId for own profile as a string
          if (currentUser && currentUser.userId) {
            userProfile.userId = String(currentUser.userId);
          }
        } catch (err) {
          console.error("Failed to fetch own profile:", err);
          // If profile doesn't exist yet, use current user info
          userProfile = {
            userId: currentUser?.userId ? String(currentUser.userId) : '',
            name: currentUser?.username || 'User',
            bio: "No bio yet",
            profilePic: "https://via.placeholder.com/150",
            interests: [],
            preferredDestinations: [],
            travelDates: {}
          };
        }
        
        stories = await travelStoryService.getUserTravelStories(currentUser?.userId);
      }
      
      // Detailed debug info before setting state
      console.log("Profile data ready:", {
        hasUserId: !!userProfile.userId,
        userId: userProfile.userId,
        userIdType: typeof userProfile.userId,
        profile: userProfile
      });
      
      setProfile(userProfile);
      setUserStories(stories || []);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-trippiko-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-4xl mx-auto my-4">
        {error}
      </div>
    );
  }

  // FIXED: Improved comparison for own profile check
  const isOwnProfile = currentUser && 
    ((!userId && currentUser.userId) || 
    (userId && String(userId) === String(currentUser.userId)));

  return (
    <div className="max-w-4xl mx-auto p-4 bg-trippiko-dark">
      {/* Main Profile Container */}
      <div className="flex flex-col gap-6">
        {/* Profile Card Section - Always explicitly pass userId */}
        <div className="rounded-xl overflow-hidden shadow-lg border border-trippiko-accent/20">
          {/* FIXED: Pass profile with guaranteed userId */}
          <ProfileCard 
            profile={profile ? {
              ...profile,
              userId: String(profile.userId || userId || (currentUser && currentUser.userId) || '')
            } : null} 
          />
        </div>

        {/* Travel Plan Section */}
        <div className="bg-trippiko-card rounded-xl shadow-lg overflow-hidden border border-trippiko-accent/20">
          <div className="bg-gradient-to-r from-trippiko-accent to-trippiko-accent/70 px-6 py-3">
            <h2 className="text-2xl font-bold text-trippiko-dark">Travel Plan</h2>
          </div>
          
          <div className="p-6">
            {profile?.preferredDestinations?.length > 0 ? (
              <div className="space-y-6">
                {/* Preferred Destinations */}
                <div>
                  <h3 className="text-lg font-semibold text-trippiko-accent mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Preferred Destinations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredDestinations.map((dest, idx) => (
                      <span key={idx} className="bg-trippiko-accent text-trippiko-dark px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                        {dest}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Travel Dates */}
                {profile.travelDates?.from && profile.travelDates?.to && (
                  <div>
                    <h3 className="text-lg font-semibold text-trippiko-accent mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Travel Dates
                    </h3>
                    <div className="bg-trippiko-light/10 p-3 rounded-lg flex flex-wrap gap-4">
                      <div className="flex items-center">
                        <span className="font-medium text-trippiko-accent">From:</span>
                        <span className="ml-2">{new Date(profile.travelDates.from).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-trippiko-accent">To:</span>
                        <span className="ml-2">{new Date(profile.travelDates.to).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-trippiko-light/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-trippiko-light mb-4">No travel plans added yet.</p>
                {isOwnProfile && (
                  <Link 
                    to="/travel-plan"
                    className="inline-block bg-trippiko-accent text-trippiko-dark px-5 py-2 rounded-full font-medium transition-all hover:bg-opacity-90 shadow-md"
                  >
                    Update Travel Plan
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      
        {/* Add Travel Story Button - Only for own profile */}
        {isOwnProfile && (
          <div className="flex justify-center my-4">
            <Link 
              to="/create-story"
              className="inline-flex items-center justify-center bg-trippiko-accent text-trippiko-dark rounded-full w-14 h-14 shadow-xl hover:bg-opacity-90 transition-all text-3xl font-bold"
              title="Add Travel Story"
            >
              +
            </Link>
          </div>
        )}
        
        {/* Travel Stories Section */}
        <div className="bg-trippiko-card rounded-xl shadow-lg overflow-hidden border border-trippiko-accent/20">
          <div className="bg-gradient-to-r from-trippiko-accent to-trippiko-accent/70 px-6 py-3">
            <h2 className="text-2xl font-bold text-trippiko-dark">Travel Stories</h2>
          </div>
          
          <div className="p-6">
            {userStories.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {userStories.map((story) => (
                  <FeedPost key={story._id} post={story} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-trippiko-dark/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-trippiko-light/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <h2 className="text-xl font-bold text-trippiko-accent mb-2">No Travel Stories Yet</h2>
                <p className="text-trippiko-light mb-4">Share your adventures with the world!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
