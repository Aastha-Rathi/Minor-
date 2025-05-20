import React, { useState, useRef, useEffect } from "react";
import chatService from "../services/chatService";
import socketService from "../services/socketService";
import authService from "../services/authService";

// Example props: recipient = { name: "Akshay", profilePic: "..." }
const ChatWindow = ({ recipient, messages = [], onSend, onClose }) => {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [chatMessages, setChatMessages] = useState(messages);
  const messagesEndRef = useRef(null);
  const currentUser = authService.getUserInfo();
  
  // Debug the props to ensure data is correct
  useEffect(() => {
    console.log("ChatWindow props:", {
      recipient,
      hasRecipientId: !!recipient?.userId,
      recipientId: recipient?.userId,
      initialMessages: messages.length,
      currentUser
    });
    
    // If no recipient ID, log an error
    if (!recipient?.userId) {
      console.error("ChatWindow: No recipient userId provided!");
    }
  }, [recipient, messages, currentUser]);
  
  // Initialize socket connection and join private room
  useEffect(() => {
    if (!recipient || !recipient.userId || !currentUser) {
      console.error("ChatWindow: Missing required data for socket:", {
        hasRecipient: !!recipient,
        hasRecipientId: !!recipient?.userId,
        hasCurrentUser: !!currentUser
      });
      return;
    }
    
    // Initialize socket connection
    const socket = socketService.getSocket();
    if (!socket) {
      console.error("ChatWindow: Failed to initialize socket");
      return;
    }
    
    // Join private chat room with this recipient
    const roomId = socketService.joinPrivateRoom(recipient.userId);
    console.log("Joined chat room:", roomId);
    
    // Listen for incoming messages
    const unsubscribe = socketService.onPrivateMessage((message) => {
      console.log("Received message:", message);
      
      // Only add messages between current user and this recipient
      if ((message.senderId === currentUser.userId && message.receiverId === recipient.userId) ||
          (message.senderId === recipient.userId && message.receiverId === currentUser.userId)) {
        
        const newMessage = {
          text: message.messageText,
          fromMe: message.senderId === currentUser.userId,
          timestamp: message.timestamp
        };
        
        setChatMessages(prevMessages => [...prevMessages, newMessage]);
      }
    });
    
    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [recipient, currentUser]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending || !recipient?.userId) return;
    
    setIsSending(true);
    try {
      // Create message object for optimistic update
      const newMessage = {
        text: input.trim(),
        fromMe: true,
        timestamp: new Date().toISOString()
      };
      
      // Add to UI immediately (optimistic update)
      setChatMessages(prevMessages => [...prevMessages, newMessage]);
      
      // First store in database using regular API
      await chatService.sendMessage(recipient.userId, input.trim());
      
      // Then send via socket for real-time delivery
      await socketService.sendPrivateMessage(recipient.userId, input.trim());
      
      // Notify parent component
      if (onSend) onSend(input.trim());
      
      // Clear input
      setInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
      // Could remove the optimistic update here if needed
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 w-full max-w-md bg-trippiko-card shadow-2xl rounded-2xl flex flex-col border border-trippiko-accent/20 z-50">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-trippiko-accent to-trippiko-accent/70 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <img
            src={recipient?.profilePic || "https://via.placeholder.com/40"}
            alt={recipient?.name || "User"}
            className="w-10 h-10 rounded-full border-2 border-white shadow-md"
          />
          <span className="font-heading text-lg font-semibold text-trippiko-dark">
            {recipient?.name || recipient?.username || "User"}
            {recipient?.userId && <span className="text-xs ml-2 opacity-50">#{recipient.userId}</span>}
          </span>
        </div>
        <button 
          onClick={onClose}
          className="text-trippiko-dark hover:text-gray-700 bg-white/80 rounded-full w-6 h-6 flex items-center justify-center shadow-sm"
          aria-label="Close chat"
        >
          ×
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 bg-trippiko-dark/10 min-h-[300px] max-h-[400px] overflow-y-auto">
        {chatMessages.length === 0 && (
          <div className="flex flex-col items-center text-trippiko-light mt-10 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-trippiko-light/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No messages yet. Say hello!</p>
          </div>
        )}
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.fromMe ? "justify-end" : "justify-start"} mb-4`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow-sm ${
                msg.fromMe
                  ? "bg-trippiko-accent text-trippiko-dark"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              <div>{msg.text}</div>
              {msg.timestamp && (
                <div className={`text-xs mt-1 ${msg.fromMe ? 'text-trippiko-dark/70' : 'text-gray-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 bg-trippiko-card rounded-b-2xl border-t border-trippiko-accent/10">
        <input
          className="flex-1 rounded-full px-4 py-2 border border-trippiko-accent/20 focus:outline-none focus:ring-2 focus:ring-trippiko-accent bg-white/90"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className={`bg-trippiko-accent text-trippiko-dark px-4 py-2 rounded-full font-semibold ${
            isSending || !input.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
          } transition-all shadow-md flex items-center gap-1`}
        >
          {isSending ? (
            <>
              <span className="w-4 h-4 border-2 border-trippiko-dark border-t-transparent rounded-full animate-spin mr-1"></span>
              Sending
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;