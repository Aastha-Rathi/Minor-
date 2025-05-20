const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { multerErrorHandler } = require("./utils/multer");
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');


dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json()); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers);
  next();
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// Socket.IO Authentication Middleware
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);

    // Join user's personal room
    socket.join(socket.userId);

    // Handle joining a chat room
    socket.on('joinChat', (otherUserId) => {
        const roomId = [socket.userId, otherUserId].sort().join('_');
        socket.join(roomId);
    });

    // Handle new messages
    socket.on('sendMessage', async (data) => {
        const { receiverId, messageText } = data;
        const roomId = [socket.userId, receiverId].sort().join('_');
        
        // Emit to the specific chat room
        io.to(roomId).emit('newMessage', {
            senderId: socket.userId,
            receiverId,
            messageText,
            timestamp: new Date()
        });
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.userId);
    });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const travelStoryRoutes = require('./routes/travelStoryRoutes');
const imageRoutes = require('./routes/imageRoutes');
const chatRoutes = require('./routes/chatRoutes');

// endpoints
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/travel-stories', travelStoryRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/chat', chatRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
