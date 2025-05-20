const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middlewares/auth'); // Assuming you have an auth middleware

// Get chat history between two users
router.get('/:userId', auth, chatController.getChatHistory);

// Save a new message
router.post('/', auth, chatController.saveMessage);

module.exports = router; 