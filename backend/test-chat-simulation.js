const io = require('socket.io-client');
const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000';
const USER1_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmFlNmMzYjAyMzcxN2M4MmM5OGZhOCIsInVzZXJJZCI6IjYyOWNlYWUzLWU1NDEtNGI1ZC1hZDQxLWExNDI5NzU2NGQ0ZSIsInVzZXJuYW1lIjoiYWFzdGhhIiwiaWF0IjoxNzQ3NjgyOTM3fQ.zSEKUJHa8ZFxpbXvfO68tNZwPaT_BUQ1J00kcMTAFTA';
const USER2_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmI4NjcwOTY0YmRkNWU5ZGQ4ZGEyMyIsInVzZXJJZCI6IjU3NWZkYjAzLWM0ZDgtNDUyNC1iYmJiLWRjYTQ5ZGU5ZTE1YSIsInVzZXJuYW1lIjoibmlrdW5qIiwiaWF0IjoxNzQ3NjgzMDA0fQ.ZBSqjTYtqQKXmfeD78ssuzf-AQANnf9tU4q8LaoR7gI';
const USER1_ID = '10ec4e4e-1e73-4750-9cf0-950f07d6908f';
const USER2_ID = '575fdb03-c4d8-4524-bbbb-dca49de9e15a';

console.log('Starting chat test...');
console.log('User 1 ID:', USER1_ID);
console.log('User 2 ID:', USER2_ID);

// Create two socket connections with explicit configuration
const user1Socket = io(BASE_URL, {
    auth: { token: USER1_TOKEN },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 10000
});

const user2Socket = io(BASE_URL, {
    auth: { token: USER2_TOKEN },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 10000
});

// User 1 Socket Events
user1Socket.on('connect', () => {
    console.log('User 1 connected successfully');
    
    // Join chat room with User 2
    user1Socket.emit('joinChat', USER2_ID);
    console.log('User 1 joined chat with User 2');

    // Send a message after 2 seconds
    setTimeout(() => {
        const message = {
            receiverId: USER2_ID,
            messageText: 'Hello from User 1!'
        };
        console.log('User 1 attempting to send message:', message);
        user1Socket.emit('sendMessage', message);
    }, 2000);
});

user1Socket.on('newMessage', (message) => {
    console.log('User 1 received message:', message);
});

// User 2 Socket Events
user2Socket.on('connect', () => {
    console.log('User 2 connected successfully');
    
    // Join chat room with User 1
    user2Socket.emit('joinChat', USER1_ID);
    console.log('User 2 joined chat with User 1');

    // Send a message after 4 seconds
    setTimeout(() => {
        const message = {
            receiverId: USER1_ID,
            messageText: 'Hi User 1, this is User 2!'
        };
        console.log('User 2 attempting to send message:', message);
        user2Socket.emit('sendMessage', message);
    }, 4000);
});

user2Socket.on('newMessage', (message) => {
    console.log('User 2 received message:', message);
});

// Error handling
user1Socket.on('connect_error', (error) => {
    console.error('User 1 connection error:', error.message);
    console.error('Error details:', error);
});

user2Socket.on('connect_error', (error) => {
    console.error('User 2 connection error:', error.message);
    console.error('Error details:', error);
});

user1Socket.on('error', (error) => {
    console.error('User 1 socket error:', error);
});

user2Socket.on('error', (error) => {
    console.error('User 2 socket error:', error);
});

// Test REST API endpoints
async function testRestAPI() {
    try {
        console.log('\nTesting REST API endpoints...');
        
        // Get chat history between users
        console.log('Fetching chat history...');
        const chatHistory = await axios.get(`${BASE_URL}/api/chat/${USER2_ID}`, {
            headers: { 
                'Authorization': `Bearer ${USER1_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Chat History:', chatHistory.data);

        // Send a message via REST API
        console.log('\nSending message via REST API...');
        const newMessage = await axios.post(`${BASE_URL}/api/chat`, {
            receiverId: USER2_ID,
            messageText: 'Hello via REST API!'
        }, {
            headers: { 
                'Authorization': `Bearer ${USER1_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Message sent via REST API:', newMessage.data);
    } catch (error) {
        console.error('REST API Test Error:', error.response?.data || error.message);
        if (error.response) {
            console.error('Error status:', error.response.status);
            console.error('Error data:', error.response.data);
        }
    }
}

// Run REST API tests after 6 seconds
setTimeout(testRestAPI, 6000);

// Cleanup after 10 seconds
setTimeout(() => {
    console.log('\nTest completed. Disconnecting...');
    user1Socket.disconnect();
    user2Socket.disconnect();
    process.exit(0);
}, 10000); 