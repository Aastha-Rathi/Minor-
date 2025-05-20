const io = require('socket.io-client');
const axios = require('axios');

// Replace these with actual values from your system
const BASE_URL = 'http://localhost:5000';
const TOKEN = 'your_jwt_token_here'; // Get this from your login endpoint
const OTHER_USER_ID = 'other_user_id_here'; // ID of the user you want to chat with

// Test REST API endpoints
async function testRestAPI() {
    try {
        // Test getting chat history
        const chatHistory = await axios.get(`${BASE_URL}/api/chat/${OTHER_USER_ID}`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        console.log('Chat History:', chatHistory.data);

        // Test sending a message
        const newMessage = await axios.post(`${BASE_URL}/api/chat`, {
            receiverId: OTHER_USER_ID,
            messageText: 'Hello from test script!'
        }, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        console.log('New Message:', newMessage.data);
    } catch (error) {
        console.error('REST API Test Error:', error.response?.data || error.message);
    }
}

// Test Socket.IO functionality
function testSocketIO() {
    const socket = io(BASE_URL, {
        auth: { token: TOKEN }
    });

    socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
        
        // Join chat room
        socket.emit('joinChat', OTHER_USER_ID);
        console.log('Joined chat room with:', OTHER_USER_ID);

        // Send a test message
        socket.emit('sendMessage', {
            receiverId: OTHER_USER_ID,
            messageText: 'Hello via Socket.IO!'
        });
        console.log('Sent test message');
    });

    socket.on('newMessage', (message) => {
        console.log('Received new message:', message);
    });

    socket.on('connect_error', (error) => {
        console.error('Socket.IO Connection Error:', error.message);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
    });
}

// Run tests
console.log('Testing REST API...');
testRestAPI();

console.log('\nTesting Socket.IO...');
testSocketIO(); 