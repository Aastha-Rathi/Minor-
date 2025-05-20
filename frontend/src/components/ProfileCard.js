// import React from "react";

// const ProfileCard = ({ profile }) => (
//   <div className="bg-trippiko-card rounded-lg shadow p-6 flex flex-col md:flex-row items-center gap-6 mb-8">
//     <img src={profile?.profilePic || "https://via.placeholder.com/100"} alt={profile?.name || "User"} className="w-24 h-24 rounded-full" />
//     <div className="flex-1">
//       <h2 className="text-2xl font-bold text-trippiko-accent">{profile?.name || "User Name"}</h2>
//       <p className="text-trippiko-light mb-2">{profile?.bio || "User bio goes here."}</p>
//       <div className="flex gap-2 mb-2">
//         <span className="bg-trippiko-accent text-trippiko-dark px-2 py-1 rounded text-xs">{profile?.travelerType || "solo"}</span>
//         {profile?.interests?.map((interest, idx) => (
//           <span key={idx} className="bg-trippiko-light text-trippiko-dark px-2 py-1 rounded text-xs">{interest}</span>
//         ))}
//       </div>
//       <button className="bg-trippiko-accent text-trippiko-dark px-4 py-2 rounded mt-2">Message</button>
//     </div>
//   </div>
// );

// export default ProfileCard;


import React, { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import chatService from "../services/chatService";
import authService from "../services/authService";
import socketService from "../services/socketService";

const ProfileCard = ({ profile }) => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentUser = authService.getUserInfo();
  
  // Debug the profile and current user with more detailed info
  useEffect(() => {
    console.log("ProfileCard debug:", { 
      profile, 
      currentUser,
      hasCurrentUser: !!currentUser,
      hasProfileId: !!profile?.userId,
      currentUserId: currentUser?.userId,
      profileUserId: profile?.userId,
      profileType: typeof profile?.userId,
      currentUserType: typeof currentUser?.userId
    });
  }, [profile, currentUser]);
  
  // Initialize socket connection when component mounts
  useEffect(() => {
    if (currentUser) {
      // Initialize socket connection
      socketService.initializeSocket();
    }
  }, [currentUser]);
  
  // Fetch messages when chat is opened
  useEffect(() => {
    if (showChat && profile && profile.userId) {
      fetchMessages();
    }
  }, [showChat, profile]);

  const fetchMessages = async () => {
    if (!profile?.userId) return;
    
    setLoading(true);
    try {
      const chatHistory = await chatService.getChatHistory(profile.userId);
      // Transform messages to the format expected by the component
      const formattedMessages = chatHistory.map(msg => ({
        text: msg.messageText,
        fromMe: msg.senderId === currentUser?.userId,
        timestamp: msg.timestamp || new Date(msg.createdAt).toISOString()
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (msg) => {
    // The actual message sending is now handled in the ChatWindow component
    console.log("Message sent callback:", msg);
  };

  const handleOpenChat = () => {
    // Make sure socket is initialized
    socketService.getSocket();
    
    // Show chat window
    setShowChat(true);
  };

  // Don't render anything if there's no profile
  if (!profile) return null;

  // FIXED: Extremely simplified check for own profile
  // Convert both IDs to strings and trim any whitespace
  const currentUserId = String(currentUser?.userId || '').trim();
  const profileUserId = String(profile?.userId || '').trim();
  
  // Only consider it the user's own profile if both IDs exist and match exactly
  const isCurrentUserProfile = 
    currentUserId !== '' && 
    profileUserId !== '' && 
    currentUserId === profileUserId;
  
  console.log("Message button check:", {
    currentUserId,
    profileUserId,
    isCurrentUserProfile,
    shouldShowMessageButton: !isCurrentUserProfile
  });

  return (
    <div className="w-full">
      <div className="px-6 py-8 flex flex-col md:flex-row gap-6 items-center">
        {/* Profile Image with Status Indicator */}
        <div className="relative">
          <img
            src={profile?.profilePic || "https://via.placeholder.com/100"}
            alt={profile?.name || "User"}
            className="w-28 h-28 rounded-full object-cover border-4 border-trippiko-accent shadow-lg"
          />
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-trippiko-card"></div>
        </div>
        
        {/* Profile Info */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <h2 className="text-3xl font-bold text-trippiko-accent">
            {profile?.name || profile?.username || "User Name"}
          </h2>
          
          <p className="text-trippiko-light text-lg italic">
            {profile?.bio || "No bio available"}
          </p>
          
          {/* User Details */}
          <div className="flex flex-wrap gap-2 my-3 justify-center md:justify-start">
            {profile?.travelerType && (
              <span className="bg-trippiko-accent text-trippiko-dark px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                {profile.travelerType === 'solo' ? 'Solo Traveler' : 'Group Traveler'}
              </span>
            )}
            
            {profile?.interests && profile.interests.length > 0 && 
              profile.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="bg-trippiko-light/20 text-trippiko-light px-4 py-1.5 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))
            }
          </div>
          
          {/* FIXED: Message Button with simpler condition */}
          {(!isCurrentUserProfile) && (
            <button
              className="bg-trippiko-accent text-trippiko-dark px-8 py-2.5 rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-md flex items-center gap-2 z-10"
              onClick={handleOpenChat}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Message
            </button>
          )}
        </div>
      </div>
      
      {/* Chat Window */}
      {showChat && (
        <ChatWindow
          recipient={profile}
          messages={messages}
          onSend={handleSend}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default ProfileCard;