const io = require('socket.io-client');
const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5000';
const USER1_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmFlNmMzYjAyMzcxN2M4MmM5OGZhOCIsInVzZXJJZCI6IjYyOWNlYWUzLWU1NDEtNGI1ZC1hZDQxLWExNDI5NzU2NGQ0ZSIsInVzZXJuYW1lIjoiYWFzdGhhIiwiaWF0IjoxNzQ3NjgyOTM3fQ.zSEKUJHa8ZFxpbXvfO68tNZwPaT_BUQ1J00kcMTAFTA';
const USER2_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmI4NjcwOTY0YmRkNWU5ZGQ4ZGEyMyIsInVzZXJJZCI6IjU3NWZkYjAzLWM0ZDgtNDUyNC1iYmJiLWRjYTQ5ZGU5ZTE1YSIsInVzZXJuYW1lIjoibmlrdW5qIiwiaWF0IjoxNzQ3NjgzMDA0fQ.ZBSqjTYtqQKXmfeD78ssuzf-AQANnf9tU4q8LaoR7gI';
const USER1_ID = '10ec4e4e-1e73-4750-9cf0-950f07d6908f';
const USER2_ID = '575fdb03-c4d8-4524-bbbb-dca49de9e15a';

console.log('Starting simple chat test...');

// Test REST API first
async function testRestAPI() {
    try {
        console.log('\nTesting REST API...');
        
        // Send a message via REST API
        const message = {
            receiverId: USER2_ID,
            messageText: 'Hello via REST API!'
        };
        
        console.log('Sending message:', message);
        const response = await axios.post(`${BASE_URL}/api/chat`, message, {
            headers: { 
                'Authorization': `Bearer ${USER1_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Message sent successfully:', response.data);
        
        // Get chat history
        console.log('\nFetching chat history...');
        const history = await axios.get(`${BASE_URL}/api/chat/${USER2_ID}`, {
            headers: { 
                'Authorization': `Bearer ${USER1_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Chat history:', history.data);
        
    } catch (error) {
        console.error('REST API Error Details:');
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
        }
        console.error('Full error:', error);
    }
}

// Test Socket.IO
function testSocketIO() {
    console.log('\nTesting Socket.IO...');
    
    const socket = io(BASE_URL, {
        auth: { token: USER1_TOKEN },
        transports: ['websocket']
    });

    socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
        
        // Join chat room
        socket.emit('joinChat', USER2_ID);
        console.log('Joined chat room with User 2');

        // Send a test message
        const message = {
            receiverId: USER2_ID,
            messageText: 'Hello via Socket.IO!'
        };
        console.log('Sending message:', message);
        socket.emit('sendMessage', message);
    });

    socket.on('newMessage', (message) => {
        console.log('Received new message:', message);
    });

    socket.on('connect_error', (error) => {
        console.error('Socket.IO Connection Error Details:');
        console.error('Error message:', error.message);
        console.error('Error type:', error.type);
        console.error('Full error:', error);
    });

    socket.on('error', (error) => {
        console.error('Socket.IO Error Details:');
        console.error('Error message:', error.message);
        console.error('Full error:', error);
    });

    // Cleanup after 5 seconds
    setTimeout(() => {
        console.log('\nTest completed. Disconnecting...');
        socket.disconnect();
        process.exit(0);
    }, 5000);
}

// Run tests
console.log('Starting tests...');
testRestAPI().then(() => {
    testSocketIO();
}); 