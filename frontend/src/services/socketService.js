import io from 'socket.io-client';
import authService from './authService';

let socket;
const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Initialize the socket connection
const initializeSocket = () => {
  // Get the current user information (including token)
  const user = authService.getUserInfo();
  
  if (!user) {
    console.error('Cannot initialize socket: No user is logged in');
    return null;
  }
  
  // Close any existing connections
  if (socket) socket.disconnect();
  
  try {
    // Create a new socket connection with auth token
    socket = io(serverUrl, {
      auth: {
        token: localStorage.getItem('token'),
        userId: user.userId // Also send userId for fallback authentication
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Event listeners
    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    return socket;
  } catch (error) {
    console.error('Failed to initialize socket:', error);
    return null;
  }
};

// Get the socket instance (initializing if needed)
const getSocket = () => {
  if (!socket || !socket.connected) {
    console.log('Getting new socket connection...');
    return initializeSocket();
  }
  return socket;
};

// Join a private chat room with another user
const joinPrivateRoom = (otherUserId) => {
  if (!otherUserId) {
    console.error('Cannot join room: No recipient userId provided');
    return null;
  }
  
  const currentUser = authService.getUserInfo();
  if (!currentUser || !currentUser.userId) {
    console.error('Cannot join room: Current user info missing');
    return null;
  }
  
  const socket = getSocket();
  if (!socket) {
    console.error('Cannot join room: Socket not connected');
    return null;
  }
  
  // Create a unique room identifier by sorting both user IDs alphabetically
  const roomUsers = [String(currentUser.userId), String(otherUserId)].sort();
  const roomId = `private_${roomUsers.join('_')}`;
  
  console.log('Joining private room:', roomId);
  socket.emit('join_room', { roomId, userId: currentUser.userId });
  
  return roomId;
};

// Send a private message to another user
const sendPrivateMessage = (receiverId, messageText) => {
  if (!receiverId) {
    return Promise.reject(new Error('No receiver ID provided'));
  }
  
  const socket = getSocket();
  if (!socket) return Promise.reject(new Error('Socket not connected'));
  
  const currentUser = authService.getUserInfo();
  if (!currentUser) return Promise.reject(new Error('Not authenticated'));
  
  return new Promise((resolve, reject) => {
    // Construct the message object
    const messageData = {
      senderId: String(currentUser.userId),
      senderName: currentUser.username,
      receiverId: String(receiverId),
      messageText: messageText,
      timestamp: new Date().toISOString()
    };
    
    // Log the message being sent
    console.log('Sending message via socket:', messageData);
    
    // Emit the message event
    socket.emit('private_message', messageData, (acknowledgment) => {
      if (acknowledgment && acknowledgment.success) {
        resolve(messageData);
      } else {
        reject(new Error(acknowledgment?.error || 'Failed to send message'));
      }
    });
    
    // Add a timeout for the acknowledgment
    setTimeout(() => {
      reject(new Error('Message acknowledgment timeout'));
    }, 5000);
  });
};

// Listen for incoming private messages
const onPrivateMessage = (callback) => {
  const socket = getSocket();
  if (!socket) return () => {};
  
  // Remove any existing listeners to prevent duplicates
  socket.off('private_message');
  
  // Add the new listener
  socket.on('private_message', (message) => {
    console.log('Received message:', message);
    if (callback) callback(message);
  });
  
  // Return a function to remove the listener
  return () => {
    socket.off('private_message', callback);
  };
};

// Disconnect the socket
const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected manually');
  }
};

// Check connection status
const isConnected = () => {
  return !!(socket && socket.connected);
};

export default {
  initializeSocket,
  getSocket,
  joinPrivateRoom,
  sendPrivateMessage,
  onPrivateMessage,
  disconnect,
  isConnected
}; 